document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById("overlay");
  var okButton = document.getElementById("okButton");


  okButton.addEventListener("click", function() {
    overlay.style.display = "none";
  });

  overlay.style.display = "flex";
});


document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById("overlayTalk");
  var talk1 = document.getElementById("talk1");
  var talk2 = document.getElementById("talk2");

  var closeButton = document.getElementById("closeButton");
  var closeButton2 = document.getElementById("closeButton2")
  var nextButton = document.getElementById("nextButton")

  closeButton.addEventListener("click", function() {
    overlay.style.display = "none";
  });

  closeButton2.addEventListener("click", function() {
    overlay.style.display = "none";
  });

  nextButton.addEventListener("click", function(){
    talk1.style.display = "none";
    talk2.style.display = "flex"
  });
});