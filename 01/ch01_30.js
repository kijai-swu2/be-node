console.clear();

try {
  const err = new Error("Custom exception");
  err.name = "My first exception";
  err.message = "This is the exception description";
  throw err;
} catch (e) {
  console.log(`Exception name > ${e.name} \nException message > ${e.message}`);
}
