console.clear();

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("I'm the data received from server.");
      } else {
        reject("Data request failed.");
      }
    }, 1000);
  });
}

async function getData() {
  try {
    const data = await fetchData();
    console.log(`Data received using async/await \n>>>> ${data}`);
  } catch (e) {
    console.log(`Exception occured\n${e}`);
  }
}

getData();
