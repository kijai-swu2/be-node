let date = new Date();
let hour = date.getHours();

if (hour < 11) {
  console.log("아침 식사");
} else if (hour < 16) {
  console.log("점심 식사");
} else {
  console.log("저녁 식사");
}
