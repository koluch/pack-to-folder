const fs = require("fs-extra");
const { constants } = require("fs");
const path = require("path");
const os = require("os");

const lib = require("../index.js");

const NEW_PACKAGE_NAME = "new-package-name";

beforeEach(async () => {
  await fs.rmdir(NEW_PACKAGE_NAME, {
    recursive: true,
  }).catch(() => {})
})

test("rename folder", async () => {
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
});

afterEach(async () => {
  await fs.rmdir(NEW_PACKAGE_NAME, {
    recursive: true,
  }).catch(() => {})
})

