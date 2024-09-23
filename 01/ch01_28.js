console.clear();

class PersonInfo {
  constructor(name, age, address, hobby) {
    this.name = name;
    this.age = age;
    this.address = address;
    this.hobby = hobby;
  }
  addAge(age) {
    this.age += age;
  }
  getAge() {
    return this.age;
  }
}

let jane = new PersonInfo("Jane Doe", 25, "Seoul, South Korea", ["Bouldering", "Listening to Music", "Programming"]);
console.log(`Prev age: ${jane.age}`);
jane.addAge(10);
console.log(`Current age: ${jane.age}`);
