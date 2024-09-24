console.clear();

let arr = [1, 2, 3, 4, 5];
console.log(`arr = ${arr}`);

/* Map */
const arr2 = arr.map((x) => {
  return `Hello ${x}`;
});
console.log(arr2);

/* Filter */
const arrFiltered = arr.filter((x) => {
  return x % 2 != 0; // Filter condition, returns a boolean and filter the values that results in true;
});
console.log(`arrFiltered = ${arrFiltered}`);

/* For each VS For */
arr.forEach((v, i) => {
  console.log(`arrForEach = ${v}, ${i}`);
});
console.log("==============");
for (i in arr) {
  console.log(`arrForEach = ${arr[i]}, ${i}`);
}
