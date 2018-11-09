# Cloudflare Workers Testing

> Test your Cloudflare Worker from the command line.

The Workers Testing package allows you to upload your script to the cloudflareworkers.com playground and query it from the command line, allowing you to test a worker before pushing it to production.

### Install

```bash
npm install --save-dev workers-testing
```

### Usage

#### Uploading 

Edit your `package.json` to pipe the file you want to preview into the `upload-worker` cli, uploading it to the [Workers Playground](https://cloudflareworkers.com) and saving a `.cf-worker-id` file to your home directory. The `workers-testing` function will read this file when it makes testing calls.

```javascript
{
  "scripts": {
    "upload-worker": "upload-worker < my-script.js"
  },
  "dependencies": {
    "workers-testing": "^1.0.0"
  }
}
```
```bash
npm run upload-worker
```

#### Testing

Use a testing framework of your choice and import workers-testing. The function takes an object for an argument with the following keys:

```javascript
{
  testUrl: /// The url with protocal that you'd like to run the test against
  method: /// The request method
  data: /// The data to be sent
}
```

```javascript
var testWorker = require("workers-testing")
var expect = require("chai").expect

describe("Cloudflare Worker", function() {
  describe("GET request", function() {
    it("returns hello", async function() {
      const call = await testWorker({
        testUrl: "https://mydomain.com",
        method: "GET"
      })
      expect(call.data).to.equal("hello")
    })
  })

  describe("POST request", function() {
    it("returns whatever is posted to it", function(done) {
      testWorker({
        testUrl: "https://mydomain.com",
        method: "POST",
        data: "TESTING"
      }).then(res => {
        expect(res.data).to.equal("TESTING")
        done()
      })
    })
  })
})
```

You can also look at a worker in the browser by going to `https://cloudflareworkers.com/#<YOUR WORKER ID HERE>:<WEBSITE TO TEST AGAINST HERE>`. Be careful sharing this link with anyone, as they'll be able to see the contents of your worker.
