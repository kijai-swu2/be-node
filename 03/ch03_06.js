console.clear();

/* Child_process - exec */
// How to excute shell commands on Node.js
const { exec } = require("child_process");

/* ls */
// exec("ls", (err, stdout, stderr) => {
//   if (err) {
//     console.error(`Error occured: ${err}`);
//     return;
//   }
//   console.log(`Stdout: ${stdout}`);
// });

/* find */
const cmd = 'find . -name "*.txt"';
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(`Command: ${stdout}`);
});
