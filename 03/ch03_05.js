console.clear();

/* Fs - mkdir */
const fs = require("fs");

const dirName = "Seoul/SouthKorea/Asia";
fs.mkdirSync(dirName, { recursive: true });

/* Quiz - fs 모듈을 이용해 특정 디렉터리 안에 파일 생성하기 */
fs.writeFileSync(`${dirName}/test.txt`, dirName);
