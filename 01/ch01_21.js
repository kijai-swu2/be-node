console.clear();

function add1(x, y) {
  return x + y;
}
console.log(add1(3, 4));

const add2 = function (x, y) {
  return x + y;
};
console.log(add2(3, 4));

let add3 = (x, y) => {
  return x + y;
};
console.log(add3(3, 4));

let add4 = (x, y) => x + y;
console.log(add4(3, 4));
