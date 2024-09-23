console.clear();

let arr = [5, 23, "Hello!", true, "World!", -9];

for (i in arr) {
  if (i > 0 && i < 5) {
    console.log(`${i} is ${arr[i]}`);
  }
}
