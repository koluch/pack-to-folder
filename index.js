const tar = require("tar");
const minimist = require("minimist");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const CONTENT_FOLDER_NAME = "package";

function exitWithError(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const argv = minimist(process.argv.slice(2));

const renameTo = argv["renameTo"] ?? "package";

exec("npm pack", (exception, stdout, stderr) => {
  if (exception != null) {
    exitWithError(exception.message);
  }
  const outputLines = stdout.trim().split(/\r?\n/);
  const fileName = outputLines[outputLines.length - 1];

  fs.mkdtemp(path.join(os.tmpdir(), "pack-to-folder-"), (err, directory) => {
    if (err != null) {
      exitWithError(err.message);
    }
    tar
      .x({
        cwd: directory,
        file: fileName,
      })
      .then((_) => {
        fs.rmdir(renameTo, { recursive: true }, (err) => {
          if (err != null) {
            exitWithError(err.message);
          }
          const packageFullPath = path.join(directory, CONTENT_FOLDER_NAME);
          fs.rename(packageFullPath, renameTo, (err) => {
            if (err != null) {
              exitWithError(err.message);
            }
            process.exit(0);
          });
        });
      });
  });
});
