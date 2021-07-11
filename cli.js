#!/usr/bin/env node
const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

require('./index.js')(argv).then(() => {
  process.exit(0)
}).catch((e) => {
  if (e.message) {
    console.error(`ERROR: ${e.message}`)
  } else {
    console.error(e)
  }
  process.exit(1)
})
