#!/usr/bin/env node

const fs = require('fs')
const homedir = require("os").homedir()
const axios = require("axios")

const inputArg = process.argv.find((arg, i) => process.argv[i - 1] === '--input')
let data

if (inputArg) {
  // Read file contents
  try {
    data = fs.readFileSync(inputArg, "utf8")
  } catch (error) {
    console.log("Please feed a file to the command. ie upload-worker < file")
    process.exit(1)
  }
} else {
  data = process.stdin
}

const request = {
  method: 'POST',
  data,
  url: 'https://cloudflareworkers.com/script',
  headers: {
    'Content-Type': 'text/javascript; charset=UTF-8',
  }
}

async function main() {
  try {
    var response = await axios(request)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  try {
    fs.writeFileSync(`${homedir}/.cf-worker-id`, response.data.id)
  } catch (error) {
    console.log('Could not save cf-worker-id', error)
  }
}

main()
