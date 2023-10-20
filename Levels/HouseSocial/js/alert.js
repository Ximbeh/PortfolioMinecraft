    

document.addEventListener("DOMContentLoaded", function() {
  var overlayTalk = document.getElementById("overlayTalk");
  var talk = document.getElementById("talk");
  var closeButton = document.getElementById("closeButton");
  var nextButton = document.getElementById("nextButton");
  
  var images = [
    "./img/Objects/Talks/TalkTest.png",
    "./img/Objects/Talks/TalkCaire2.png",
    "./img/Objects/Talks/TalkCaire3.png",
    "./img/Objects/Talks/TalkCaire4.png",
    "./img/Objects/Talks/TalkCaire5.png",
    "./img/Objects/Talks/TalkCaire6.png"
  ];

  var currentImageIndex = 0;

  function updateImage(index) {
    talk.style.backgroundImage = `url('${images[index]}')`;
  }

  function showTalk() {
    overlayTalk.style.display = "flex";
    updateImage(currentImageIndex);
  }

  function hideTalk() {
    overlayTalk.style.display = "none";
    currentImageIndex = 0; // Reset to the first image
    updateImage(currentImageIndex);
  }

  closeButton.addEventListener("click", hideTalk);

  nextButton.addEventListener("click", function() {
    if (currentImageIndex >= 0 && currentImageIndex <= 4) {
      currentImageIndex++;
      if (currentImageIndex < images.length) {
        updateImage(currentImageIndex);
      }
    } else if (currentImageIndex === 5) {
      hideTalk();
    }
  });

  // // Show the talk when the page loads
  // showTalk();
});
