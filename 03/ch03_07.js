console.clear();

/* Getting the current directory: __dirname */
console.log(__dirname);

/* Quiz - 특정 디렉토리를 생성하고 파일에 문자열 넣어보기 */
// 최종 경로 만들기 -> 디렉토리 추출 -> 디렉토리 & 파일 생성

// Step 1 - 최종 경로 만들기
const path = require("path");
const newFilePath = path.join(__dirname, "folder", "file.txt");
// console.log(newFilePath);

// Step 2 - 최종 경로에서 파일 이름을 제외한, 디렉토리만 추출하기
const fs = require("fs");

// Step 2 v.1
const pathArr = newFilePath.split("/");
const removeFileName = pathArr.pop();
const finalPath = pathArr.join("/");

// Step 2 v.2 - path.parse를 이용해 간단히 디렉토리 추출하기
const directoryOnly = path.parse(newFilePath);
console.log(directoryOnly.dir);

// Step 3 - 디렉토리 및 파일 실제로 생성하기
fs.mkdirSync(finalPath, { recursive: true });
fs.writeFileSync(newFilePath, "Hello");
