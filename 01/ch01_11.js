let input = 14;
let result;

switch (input % 2) {
  case 0:
    result = "짝수";
    break;
  case 1:
    result = "홀수";
    break;
}

console.log(`${input}은 ${result}입니다.`);
