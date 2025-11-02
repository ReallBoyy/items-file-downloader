# items-file-downloader

A small toolset to download all files referenced in a decoded `items.dat` (converted to `items.json`) from a configured URL.

This repository expects you to already have decoded `items.dat` into `items.json`. The tool reads the item entries in `items.json` and downloads the files referenced by those entries from the configured server.

> Note: Use this repository only in accordance with the Terms of Service of any service involved. This project is provided "as-is".

## Features
- Reads a decoded `items.json` file.
- Downloads all referenced files from a configurable server URL.
- Simple configuration via `config.json`.
- Batch operation using included .bat scripts for Windows.

## Requirements
- Nodejs 18 or higher version.
https://nodejs.org/en/download

## Quick start

1. Open `config.json` and ensure the `onsupermain` (base URL) is correct. By default it targets the official Real Growtopia URL (change if you need a different source).
2. Place your decoded `items.json` in the repository folder (replace any sample file).
3. Run `install.bat` (this script sets up dependencies; if it closes when finished that is expected).
4. Run `start.bat` to begin downloading. The script will read `items.json` and download each referenced file to the appropriate folder.
5. Wait until the script finishes. Inspect the output folder to confirm files were downloaded.

## Configuration

Edit `config.json` to control how files are downloaded. Typical fields:

- `onsupermain` — Base URL used to fetch item files. Example: `https://ubistatic-a.akamaihd.net/`
- Other script-specific settings — open the file to see available options.

Example `config.json`:
```json
{
  "onsupermain": "https://ubistatic-a.akamaihd.net/0098/15230125103/cache/"
}
```

## Troubleshooting

- Script closes immediately after running `install.bat`:
  - This is expected if the script completes successfully. Re-open a terminal and run the batch file manually to see output.
- Downloads fail / 404 errors:
  - Verify `onsupermain` is correct and accessible.
  - Ensure `items.json` entries have valid paths.
- Permission errors:
  - Make sure the terminal / script has write permission to the repository folder.
- If you need cross-platform support, convert the batch logic into a shell script for Linux / macOS.

## License
Include your preferred license here (e.g., MIT). If you don't want to include one, consider adding a simple license file.

## Links
- YouTube walkthrough: http://www.youtube.com/watch?v=cQhddagFB3I?si=9wJPdGYGv64hKYCj

Enjoy — and feel free to open issues or pull requests if you want improvements or cross-platform scripts added.
