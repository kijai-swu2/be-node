const btnBack = document.getElementById("goBack");

if (btnBack) {
  btnBack.addEventListener("click", () => {
    console.log("goBack");
    history.back();
  });
}
