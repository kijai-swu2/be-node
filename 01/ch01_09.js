let date = new Date();
let hour = date.getHours();

if (hour < 12) {
  console.log(`오전 ${hour}시입니다.`);
} else {
  console.log(`오후 ${hour}시입니다.`);
}
