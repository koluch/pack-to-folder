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

test("extracting package twice without forcing should throw", async () => {
  await lib({});
  await expect(lib({})).rejects.toThrow();
});

test("extracting package twice with forcing should not throw", async () => {
  await lib({});
  await expect(lib({
    forceRewrite: true,
  })).resolves.not.toThrow();
});

beforeEach(async () => {
  await fs.rmdir('package', {
    recursive: true,
  }).catch(() => {})
})
