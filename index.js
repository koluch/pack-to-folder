const tar = require("tar");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const CONTENT_FOLDER_NAME = "package";

module.exports = (options = {}) => {
  const renameTo = options["renameTo"] ?? "package";

  return new Promise((resolve, reject) => {
    exec("npm pack", (exception, stdout, stderr) => {
      if (exception != null) {
        reject(exception.message);
        return;
      }
      const outputLines = stdout.trim().split(/\r?\n/);
      const fileName = outputLines[outputLines.length - 1];

      fs.mkdtemp(path.join(os.tmpdir(), "pack-to-folder-"), (err, directory) => {
        if (err != null) {
          reject(err.message);
          return;
        }
        tar
          .x({
            cwd: directory,
            file: fileName,
          })
          .then((_) => {
            fs.rmdir(renameTo, { recursive: true }, (err) => {
              if (err != null) {
                reject(err.message);
                return;
              }
              const packageFullPath = path.join(directory, CONTENT_FOLDER_NAME);
              fs.rename(packageFullPath, renameTo, (err) => {
                if (err != null) {
                  reject(err.message);
                  return;
                }
                resolve();
              });
            });
          })
          .catch((e) => {
            reject(`Unable to unpack file ${fileName}. ${e.message ?? 'Unknown error'}`)
          });
      });
    });
  })

}
