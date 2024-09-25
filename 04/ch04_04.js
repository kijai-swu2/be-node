console.clear();

const http = require("http");
const url = require("url");
const fs = require("fs");

const list = (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);
  console.log(result);
  const resStr = JSON.stringify(result);
  res.end(resStr);
};

http
  .createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.setHeader("Content-type", "application/json");

    if (path == "/list") {
      list(req, res);
    } else {
      res.end("Default page");
    }
  })
  .listen(4500);
