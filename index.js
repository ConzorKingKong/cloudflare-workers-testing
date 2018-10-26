const fs = require("fs")
const axios = require("axios")
const url = require("url")
const homedir = require("os").homedir()

function hex(bytes) {
  // Convert a Uint8Array to a hex string.
  return Array.prototype.map.call(bytes, (b) => ("00" + b.toString(16)).slice(-2)).join("")
}

function randomHex128() {
  // Return a random hex number of 128 bits.
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return hex(array)
}

function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}

function getRandomBytes() {
  if (!('crypto' in global)) {
    return uuid().replace(/\-/g, '')
  }

  return randomHex128()
}

async function testWorker({testUrl, method, data}) {
  const sessionId = getRandomBytes()
  const parsedUrl = url.parse(testUrl)
  const protocol = parsedUrl.protocol === 'http:' ? 0 : 1

  try {
    var workerId = fs.readFileSync(`${homedir}/.cf-worker-id`, "utf8")
  } catch(err) {
    console.log(`\`.cf-worker-id\` file not found in ${homedir}, did you run \`upload-worker\`?`)
    process.exit(1)
  }

  const options = {
    url: "https://rawhttp.cloudflareworkers.com",
    method,
    data,
    headers: {
      "CF-EW-Preview": [workerId, sessionId, protocol, parsedUrl.hostname].join('')
    }
  }
  
  try {
    var response = await axios(options)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
  
  return response
}

module.exports = testWorker
