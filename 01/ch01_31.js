console.clear();

function fetchDataOld() {
  setTimeout(() => {
    console.log(`Succesfully received data from server.`);
  }, 2000);
}

// console.log(`Requesting data to server`);
// const data = fetchDataOld();
// console.log(`Completed`, data);

function fetchData(callback) {
  setTimeout(() => {
    const data = "This is the data.";
    callback(data);
  }, 2000);
}

console.log(`Requesting data to server...`);
fetchData(function (data) {
  console.log(`Data received from the server \n>>>`, data);
});
