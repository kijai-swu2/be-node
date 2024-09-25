console.clear();

const http = require("http");
const url = require("url");

http
  .createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.setHeader("Content-type", "application/json");
    const post = { title: "Title", content: "Content" };
    if (path == "/json") {
      const postStr = JSON.stringify(post);
      console.log(postStr);
      res.end(postStr);
    } else {
      res.end("<h1>Not in operation</h1>");
    }
  })
  .listen(4500);
