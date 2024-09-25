console.clear();

const http = require("http");
const url = require("url");
const fs = require("fs");

http
  .createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.setHeader("Content-type", "application/json");

    if (path == "/json") {
      const data = fs.readFileSync("test.json", "utf-8");
      const dataParsed = JSON.parse(data);
      const dataStr = JSON.stringify(dataParsed);
      res.end(dataStr);
    } else {
      res.end("");
    }
  })
  .listen(4500);
