console.clear();

let arr = [5, 23, "Hello!", true, "World!", -9];

for (i in arr) {
  if (typeof arr[i] == "string") {
    break;
  }
  console.log(`${i} is ${arr[i]}`);
}
