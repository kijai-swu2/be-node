console.clear();

const os = require("os");

console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`CPU: ${os.cpus().length}GB`);
console.log(`Memory: ${os.totalmem() / 1024 / 1024}MB`); // mb로 반환
console.log(`Free Memory: ${os.freemem() / 1024 / 1024}MB`); // mb로 반환
