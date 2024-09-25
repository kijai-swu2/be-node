console.clear();

const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    console.log(path, req.url);
    if (path == "/hello") {
      res.end("<h1>Hello</h1>");
    } else if (path == "/world") {
      res.end("<h1>World</h1>");
    } else {
      res.end("<h1>Default page</h1>");
    }
  })
  .listen(4500);
