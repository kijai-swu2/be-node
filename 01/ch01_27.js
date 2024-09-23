console.clear();

let personInfo = {
  name: "Jane Doe",
  age: 25,
  address: "Seoul, South Korea",
  hobby: ["Bouldering", "Listening to music", "Programming"],
  addAge: function () {
    this.age += 1;
  },
  updateAddr: function (newAddress) {
    this.address = newAddress;
  },
  getAge: function () {
    return this.age;
  },
};

// console.log(`Prev age: ${personInfo.age}`);
personInfo.getAge();
console.log(`Current age: ${personInfo.age}`);

console.log(`===============`);

console.log(`Prev address: ${personInfo.address}`);
personInfo.updateAddr("London, England");
console.log(`Current address: ${personInfo.address}`);
