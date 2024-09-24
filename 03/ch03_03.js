console.clear();

/* Fs - readFile / readFileSync */
const fs = require("fs");

/* Call back 함수 이용하기 */
fs.readFile("hello.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(data);
});

/* readFileSync 이용하기 */
const data = fs.readFileSync("hello.txt", "utf-8");
console.log(data);
