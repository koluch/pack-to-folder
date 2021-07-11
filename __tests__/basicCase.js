const fs = require("fs-extra");
const { constants } = require("fs");
const path = require("path");
const os = require("os");

const lib = require("../index.js");

beforeEach(async () => {
  await fs.rmdir('package', {
    recursive: true,
  }).catch(() => {})
})

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
});

afterEach(async () => {
  await fs.rmdir('package', {
    recursive: true,
  }).catch(() => {})
})
