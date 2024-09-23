console.clear();

let personInfo = {
  name: "Jane Doe",
  age: 25,
  address: "Seoul, South Korea",
  hobby: ["Bouldering", "Listening to music", "Programming"],
};

for (key in personInfo) {
  console.log(`${key}: ${personInfo[key]}`);
}

for (key of Object.keys(personInfo)) {
  console.log(`${key}: ${personInfo[key]}`);
}
