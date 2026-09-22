const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

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
          vscode.Uri.file(path.join(__dirname, "css")),
          vscode.Uri.file(path.join(__dirname, "js")),
          vscode.Uri.file(path.join(__dirname, "assets"))
        ]
      }
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });

    currentPanel.webview.onDidReceiveMessage(message => {
      if (message?.type === "ready") {
        sendCurrentLog();
      }
    });
  } else {
    currentPanel.reveal(vscode.ViewColumn.Active);
  }

  currentPanel._logUri = uri;
  currentPanel._logName = path.basename(uri.fsPath);
  currentPanel._logText = text;
  currentPanel.title = `Log Workbench S — ${currentPanel._logName}`;

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
  const htmlPath = path.join(__dirname, "index.html");
  let html = fs.readFileSync(htmlPath, "utf8");

  const nonce = getNonce();
  const cssUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "css", "app.css"))
  );
  const jsUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "js", "app.js"))
  );
  const faviconUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(__dirname, "assets", "favicon.svg"))
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
