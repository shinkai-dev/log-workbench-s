# Log Workbench S

Log Workbench S is a VS Code log analysis extension focused on **powerful log filtering and surrounding-row inspection**. It also provides keyword search, timestamp filtering and formatting, sorting, CSV export, and performance statistics to help you investigate application logs efficiently.

## Demo

### Log Filtering and Keyword Search

Filter error, warning, and slow-operation rows, or search logs by keyword to focus on the entries you need.

![Log Filtering and Keyword Search](https://raw.githubusercontent.com/shinkai-dev/cdn/main/vscode-extensions/log-workbench-s/filter.gif)

---

### Surrounding-Row Inspection

Inspect matching log entries with configurable surrounding-row options while keeping the results focused on the filtered log set.

![Surrounding-Row Inspection](https://raw.githubusercontent.com/shinkai-dev/cdn/main/vscode-extensions/log-workbench-s/context-rows.gif)

---

## Features

### Powerful Log Filtering

- Filter error and warning log entries
- Filter slow-operation entries based on the interval from the previous log entry
- Search log messages by keyword
- Filter logs by start and end timestamps
- Display detected minimum and maximum timestamps
- Clear all filter conditions with the clear button
- Combine keyword filtering with error and other filter conditions

### Surrounding-Row Inspection

- Display matching target rows only or configure surrounding-row display options
- Include preceding and/or following rows around matching entries
- Configure the number of surrounding rows
- Keep surrounding-row selection focused on the keyword-filtered log set
- Avoid mixing unrelated keyword groups when inspecting log context

### Timestamp Analysis and Formatting

- Automatically detect timestamps in log entries
- Support logs containing only time values
- Display timestamps in local date and time format
- Display date only or time only
- Convert timestamps to ISO 8601 UTC
- Display timestamps as Unix milliseconds
- Preserve the original timestamp text
- Calculate the interval from the previous log entry

### Performance Statistics

- Calculate average intervals between consecutive log entries
- Calculate median intervals
- Display maximum intervals
- Calculate P95 intervals
- Use interval statistics as a reference when analyzing sequential log processing

### Sorting and Export

- Sort log entries for easier inspection
- Copy visible log rows
- Export the current log view as CSV

### Display and Customization

- English and Japanese interface
- Dark theme by default
- Light and High Contrast themes
- Small, Medium, and Large font sizes
- Adjustable timestamp display formats

### Preview and Privacy

- Open supported log files directly in a VS Code webview
- Analyze log contents locally within VS Code
- No external server or API is required to process log contents

## Supported File Extensions

- `.log`
- `.txt`
- `.out`
- `.trace`
- `.json`
- `.csv`

## Usage

### From the Explorer

1. Select a supported log file in the VS Code Explorer.
2. Right-click the file.
3. Select `Open with Log Workbench S`.

![Log Filtering and Keyword Search](https://raw.githubusercontent.com/shinkai-dev/cdn/main/vscode-extensions/log-workbench-s/open1.gif)

### From the Editor Tab

1. Open a supported log file in VS Code.
2. Right-click the file's editor tab.
3. Select `Open with Log Workbench S`.

![Log Filtering and Keyword Search](https://raw.githubusercontent.com/shinkai-dev/cdn/main/vscode-extensions/log-workbench-s/open2.gif)

### Filtering and Inspecting Logs

1. Open a log file with Log Workbench S.
2. Apply the required filters, such as error, warning, slow-operation, keyword, or timestamp filters.
3. Configure the surrounding-row options to inspect the relevant log entries.
4. Sort the results or copy visible rows as needed.
5. Review timestamp intervals and performance statistics to help investigate the log data.

### Exporting Results

1. Apply the filters you need.
2. Use the CSV export feature to export the current log view.
3. Choose the destination for the exported CSV file.
