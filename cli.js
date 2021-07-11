#!/usr/bin/env node
const minimist = require("minimist");
const argv = minimist(process.argv.slice(2));

require('./index.js')(argv).then(() => {
  process.exit(0)
}).catch((e) => {
  console.error(`ERROR: ${e.message || 'Unknown error'}`, e)
  process.exit(1)
})
