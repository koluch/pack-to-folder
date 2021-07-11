const fs = require("fs-extra");
const { constants } = require("fs");
const path = require("path");
const os = require("os");

const lib = require("../index.js");

test("no options", async () => {
  await lib({});
  expect(async () => {
    await fs.access('package', constants.R_OK | constants.W_OK);
  }).not.toThrow()
  const files = await fs.readdir("./package")

  const expectedFiles = [
    "package.json",
    "README.md",
    "cli.js",
    "index.js",
  ];
  expect(files).toHaveLength(expectedFiles.length)
  expect(files).toEqual(expect.arrayContaining(expectedFiles))

  await fs.rmdir('package', {
    recursive: true,
  })
});

test("raname package folder", async () => {
  const NEW_PACKAGE_NAME = "new-package-name";
  await lib({
    renameTo: NEW_PACKAGE_NAME
  });
  expect(async () => {
    await fs.access(NEW_PACKAGE_NAME, constants.R_OK | constants.W_OK);
  }).not.toThrow()
  const files = await fs.readdir(NEW_PACKAGE_NAME)

  const expectedFiles = [
    "package.json",
    "README.md",
    "cli.js",
    "index.js",
  ];
  expect(files).toHaveLength(expectedFiles.length)
  expect(files).toEqual(expect.arrayContaining(expectedFiles))

  await fs.rmdir(NEW_PACKAGE_NAME, {
    recursive: true,
  })
});

