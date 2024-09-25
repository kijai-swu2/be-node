console.clear();

const fs = require("fs");
const { title } = require("process");

const result = fs.readFileSync("03/test.json", "utf-8");
// console.log(result);

const data = JSON.parse(result);
console.log(data["result"]);

const resultArr = data["result"];
const titleArr = resultArr.title;

resultArr.forEach((i) => {
  console.log(i.title);
  console.log("--- --- ---");
});

for (i in titleArr) {
  console.log(titleArr[i]["title"]);
  console.log("--- --- ---");
}

/* Not working */
resultArr.forEach((i) => {
  console.log(titleArr);
  console.log("--- --- ---");
});
