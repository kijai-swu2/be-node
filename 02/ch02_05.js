console.clear();

/* 예제 1 */
const http = require("http");
http
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "text/plain");

    /* array 사용 시 */
    // const arr = [...Array(10).keys()];
    // const arr2 = arr.map((x) => {
    //   return "Hello, World! " + (x + 1);
    // });
    // const content = arr2.join("\n");

    /* for loop 사용 시 */
    let arr = new Array();
    for (i = 1; i <= 10; i++) {
      arr.push(`Hello, World! ${i}`);
    }
    const content = arr.join("\n");

    console.log(content);
    res.write(content);
    res.end();
  })
  .listen(4500);
