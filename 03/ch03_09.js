console.clear();

const fs = require("fs");

let result = [];
for (i = 1; i <= 10; i++) {
  result.push({ title: `This it the title ${i}.`, content: `Contents #${i}.` });
}
// console.log(JSON.stringify(result));

const data = {
  result: result,
};

const strData = JSON.stringify(data);
fs.writeFileSync("03/test.json", strData, "utf-8");
