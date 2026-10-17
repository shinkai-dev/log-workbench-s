const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const os = require("os");

let currentPanel;

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("logWorkbenchS.openLog", async (resource) => {
      const uri = resource instanceof vscode.Uri
        ? resource
        : vscode.window.activeTextEditor?.document?.uri;

      if (!uri) {
        vscode.window.showInformationMessage("Select a log file first.");
        return;
      }

      try {
        const stat = await vscode.workspace.fs.stat(uri);
        if (stat.type !== vscode.FileType.File) {
          vscode.window.showWarningMessage("The selected item is not a file.");
          return;
        }

        const bytes = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(bytes).toString("utf8");
        await showLogWorkbench(uri, text);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Log Workbench S: Could not read the file. ${error?.message || error}`
        );
      }
    })
  );
}

async function showLogWorkbench(uri, text) {
  if (!currentPanel) {
    currentPanel = vscode.window.createWebviewPanel(
      "logWorkbenchS",
      "Log Workbench S",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(__dirname, "webview", "css")),
          vscode.Uri.file(path.join(__dirname, "webview", "js")),
          vscode.Uri.file(path.join(__dirname, "webview", "assets"))
        ]
      }
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });

    currentPanel.webview.onDidReceiveMessage(async message => {
      if (message?.type === "ready") {
        sendCurrentLog();
        return;
      }
      if (message?.type === "exportCsv" && typeof message.content === "string") {
        try {
          const suggestedName = typeof message.fileName === "string" && message.fileName.trim()
            ? path.basename(message.fileName)
            : "log.csv";
          const target = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(path.join(os.homedir(), suggestedName)),
            saveLabel: "Export CSV",
            filters: { "CSV files": ["csv"] }
          });
          if (!target) {
            currentPanel?.webview.postMessage({ type: "csvExportResult", status: "cancelled" });
            return;
          }
          await vscode.workspace.fs.writeFile(target, Buffer.from(message.content, "utf8"));
          currentPanel?.webview.postMessage({ type: "csvExportResult", status: "success", path: target.fsPath });
        } catch (error) {
          vscode.window.showErrorMessage(`Log Workbench S: CSV export failed. ${error?.message || error}`);
          currentPanel?.webview.postMessage({ type: "csvExportResult", status: "error" });
        }
      }
    });
  } else {
    currentPanel.reveal(vscode.ViewColumn.Active);
  }

  currentPanel._logUri = uri;
  currentPanel._logName = path.basename(uri.fsPath);
  currentPanel._logText = text;
  currentPanel.title = currentPanel._logName;

  if (!currentPanel.webview.html) {
    currentPanel.webview.html = getWebviewContent(currentPanel.webview);
  }

  sendCurrentLog();
}

function sendCurrentLog() {
  if (!currentPanel || currentPanel._logText == null) return;

  currentPanel.webview.postMessage({
    type: "loadLog",
    name: currentPanel._logName,
    text: currentPanel._logText
  });
}

function getWebviewContent(webview) {
  const htmlPath = path.join(__dirname, "webview", "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");

  const nonce = getNonce();
  const cssUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "webview", "css", "app.css"))
  );
  const jsUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "webview", "js", "app.js"))
  );
  const faviconUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "webview", "assets", "favicon.svg"))
  );

  html = html
    .replace(/css\/app\.css/g, cssUri.toString())
    .replace(/js\/app\.js/g, jsUri.toString())
    .replace(/assets\/favicon\.svg/g, faviconUri.toString())
    .replace(
      "<head>",
      `<head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">`
    )
    .replace(
      `<script src="${jsUri.toString()}"></script>`,
      `<script nonce="${nonce}" src="${jsUri.toString()}"></script>`
    );

  return html;
}

function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < 32; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

function deactivate() {}

module.exports = { activate, deactivate };
