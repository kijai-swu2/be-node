console.clear();

/* Quiz */
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. 11~20 추가
for (i = 11; i <= 20; i++) {
  data.push(i);
}
console.log(data);

// 2. data2 배열 만들고 각 요소에 *2하기
let data2 = data.map((x) => x * 2);
console.log(data2);

// 3. 짝수만 가진 배열 만들기
const data3 = data.filter((x) => {
  return x % 2 == 0;
});
console.log(data3);

// 4. data 배열 중 5 이상, 15 이하인 값 출력하기
// Filter 사용 -> Array로 반환
const data4 = data.filter((x) => {
  return x >= 5 && x <= 15;
});
console.log(data4);

// For each 사용 -> 단순 출력
console.log(data);
data.forEach((x) => {
  if (x >= 5 && x <= 15) {
    console.log(x);
  }
});

// For loop 사용
for (i in data) {
  if (data[i] >= 5 && data[i] <= 15) {
    console.log(data[i]);
  }
}
