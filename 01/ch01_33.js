console.clear();

function fetchData() {
  return new Promise((resolve, reject) => {
    const success = true;
    if (success) {
      resolve(`Data received from server.`);
    } else {
      reject(`Data request failed.`);
    }
    console.log("========================================");
  });
}

fetchData()
  .then((data) => {
    console.log(`Data received via Promise\n${data}`);
  })
  .catch((error) => {
    console.log(`Exception occured\n${error}`);
  });
