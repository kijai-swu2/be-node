console.clear();

function tenTimes(callback) {
  for (i = 1; i <= 10; i++) {
    callback(i);
  }
}

tenTimes(function () {
  console.log(`${i} times`);
});
