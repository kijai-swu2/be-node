console.clear();

/* Fs - writeFile / writeFileSync */
const fs = require("fs");

const content = "Hello,\nnice to meet you!";
fs.writeFile("hello2.txt", content, (err) => {});

const content2 = "Hello,\nnice to meet you!";
fs.writeFileSync("hello3.txt", content2);
