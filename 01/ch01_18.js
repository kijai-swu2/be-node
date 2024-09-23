console.clear();

let output = "";

for (i = 0; i < 10; i++) {
  for (let j = 0; j < i + 1; j++) {
    output += "*";
  }
  output += "\n";
}

console.log(output);
