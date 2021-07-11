const tar = require("tar");

const { exec } = require("child_process");
const fs = require("fs");

const CONTENT_FOLDER_NAME = "package";

module.exports = async (options = {}) => {
  const renameTo = options["renameTo"] || "package";
  const forceRewrite = options["forceRewrite"] || false;

  const archiveFileName = await new Promise((resolve, reject) => {
    exec("npm pack", (exception, stdout, stderr) => {
      if (exception != null) {
        reject(exception);
        return;
      }
      const outputLines = stdout.trim().split(/\r?\n/);
      const fileName = outputLines[outputLines.length - 1];
      resolve(fileName);
    });
  });

  const dirExists = await new Promise((resolve, reject) => {
    fs.access(renameTo, fs.constants.R_OK, (err) => {
      resolve(err == null);
    });
  });

  if (dirExists) {
    if (!forceRewrite) {
      throw new Error(
        `Target directory already exists. Pass '--forceRewrite' option to remove target directory before unpacking`
      );
    }
    await new Promise((resolve, reject) => {
      fs.rmdir(renameTo, { recursive: true }, (err) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  try {
    await tar.x({
      file: archiveFileName,
    });
  } catch (e) {
    throw new Error(
      `Unable to unpack file ${archiveFileName}. ${
        e.message || "Unknown error"
      }`
    );
  }
  await new Promise((resolve, reject) => {
    fs.unlink(archiveFileName, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve()
    })
  })

  if (renameTo !== CONTENT_FOLDER_NAME) {
    await new Promise((resolve, reject) => {
      fs.rename(CONTENT_FOLDER_NAME, renameTo, (err) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
};
