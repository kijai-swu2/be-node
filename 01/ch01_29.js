console.clear();

try {
  const arr = new Array(-1);
} catch (e) {
  console.log(`Exception occured > ${e}`);
} finally {
  console.log("==========");
  console.log(`Exception all handled, \nNow be normal.`);
}
