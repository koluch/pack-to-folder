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

      fs.rmdir(renameTo, { recursive: true }, (err) => {
        tar
          .x({
            file: fileName,
          })
          .then((_) => {
            if (err != null && err.code !== "ENOENT") {
              reject(err.message);
              return;
            }
            if (renameTo !== CONTENT_FOLDER_NAME) {
              fs.rename(CONTENT_FOLDER_NAME, renameTo, (err) => {
                if (err != null) {
                  reject(err.message);
                  return;
                }
                resolve();
              });
            } else {
              resolve();
            }
          })
          .catch((e) => {
            reject(
              `Unable to unpack file ${fileName}. ${
                e.message ?? "Unknown error"
              }`
            );
          });
      });
    });
  });
};
