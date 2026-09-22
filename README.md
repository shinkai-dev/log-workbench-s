# Log Workbench S

Log Workbench S is a VS Code extension for analyzing local text and log files directly inside VS Code.

It is based on the Log Workbench S local log-analysis UI and runs entirely inside a VS Code Webview. Log contents are read from the selected local file by the extension host and passed directly to the Webview for analysis. No server, upload, or external service is required.

## Features

- Open a log file from the VS Code Explorer context menu.
- Open a log file from the editor tab context menu.
- Automatic timestamp format detection.
- Elapsed-time calculation between consecutive log entries.
- Error / warning / slow-operation filtering.
- Minimum elapsed-time filtering.
- Keyword filtering with highlighted matches.
- Sorting by original line order, elapsed time, timestamp, or log level.
- Timestamp display format selection.
- Average, median, maximum, and P95 elapsed-time statistics.
- Copy the currently displayed table to the clipboard.
- Reset the current display filters and sorting.
- English / Japanese interface.
- Light / Dark / High Contrast themes.
- Drag-and-drop log loading inside the Webview.

## Supported files

The context-menu command is available for common text/log files:

- `.log`
- `.txt`
- `.out`
- `.trace`
- `.json`
- `.csv`

The Webview can also accept a local file by drag and drop.

## How to open a log

### Explorer

1. Open the VS Code Explorer.
2. Right-click a supported log file.
3. Select **Open with Log Workbench S**.

### Editor tab

1. Open a supported log file in VS Code.
2. Right-click its editor tab.
3. Select **Open with Log Workbench S**.

The selected file is loaded directly into the Log Workbench S Webview.

## Privacy and network behavior

Log Workbench S does not send log contents to a remote server.

The extension reads the selected local file through the VS Code extension host and transfers the content to its local Webview for analysis. No external API or network service is required.

## Limitations

Log Workbench S is intended for local development and test logs rather than extremely large production log datasets. Very large files can require significant memory and CPU resources.

The table rendering is intentionally capped at 20,000 displayed rows at a time to keep the Webview responsive. Filtering and statistics still operate on the complete loaded dataset.

## Extension structure

```text
log-workbench-s/
├─ package.json
├─ extension.js
├─ README.md
├─ index.html
├─ css/
│  └─ app.css
├─ js/
│  └─ app.js
└─ assets/
   └─ favicon.svg
```

## Version

1.0.0
