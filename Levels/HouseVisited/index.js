const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//Canva Size
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width,
  height: canvas.height,
};

//----------------------------------------------------------------//

//Array of the collision in a new ARRAY
const floorCollision2D = [];
for (let i = 0; i < CollisionHouseStart.length; i += 32) {
  floorCollision2D.push(CollisionHouseStart.slice(i, i + 64));
}

const collisionBlocks = [];

floorCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol != 0) {
      // console.log('aaa');
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },
        })
      );
    }
  });
});

//----------------------------------------------------------------//
//NEW ITENS

//Player
const player = new Player({
  position: {
    x: 820,
    y: 300,
  },
  collisionBlocks,
  imageSrc: "./img/Steve/Respiração.png",
  // mesma coisa que collisionBlocks: collisionBlocks,
  animations: {
    Stoped: {
      imageSrc: "./img/Steve/Respiração.png",
      frameRate: 28,
      frameBuffer: 24,
      loop: true,
    },
    StopedRight: {
      imageSrc: "./img/Steve/RespiraçãoRight.png",
      frameRate: 28,
      frameBuffer: 24,
      loop: true,
    },
    Run: {
      imageSrc: "./img/Steve/Run.png",
      frameRate: 34,
      frameBuffer: 2,
      loop: true,
    },
    RunRight: {
      imageSrc: "./img/Steve/RunRight.png",
      frameRate: 34,
      frameBuffer: 2,
      loop: true,
    },
    Jump: {
      imageSrc: "./img/Steve/Jump.png",
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
    },
    JumpRight: {
      imageSrc: "./img/Steve/JumpRight.png",
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
    },
    EnterDoor: {
      imageSrc: "./img/Steve/enterDoor.png",
      frameRate: 18,
      frameBuffer: 3,
      loop: false,
      onComplete: () => {
        console.log("completo");

        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            window.location.href = "../Village/index.html";
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
    Sleep: {
      imageSrc: "",
      onComplete: () => {
        console.log("completo");

        // gsap.to(overlay, {
        //   opacity: 1,
        //   onComplete: () => {
        //     window.location.href = "../Village/index.html";
        //     gsap.to(overlay, {
        //       opacity: 0,
        //     });
        //   },
        // });
      },
    },
  },
});

//Door
const doors = [
  new Sprite({
    position: {
      x: 836,
      y: 320,
    },
    imageSrc: "./img/Objects/Door/Door.png",
    frameRate: 4,
    frameBuffer: 6,
    loop: false,
    autoplay: false,
  }),
];

//Furnace
const Furnaces = [
  new Sprite({
    position: {
      x: 256,
      y: 384,
    },
    imageSrc: "./img/Objects/Furnace/Furnace.png",
    frameRate: 8,
    frameBuffer: 9,
    loop: true,
    autoplay: false,
    opacity: 0,
  }),
  new Sprite({
    position: {
      x: 319,
      y: 384,
    },
    imageSrc: "./img/Objects/Furnace/Furnace.png",
    frameRate: 8,
    frameBuffer: 6,
    loop: true,
    autoplay: false,
    opacity: 0,
  }),
  new Sprite({
    position: {
      x: 319,
      y: 320,
    },
    imageSrc: "./img/Objects/Furnace/Furnace.png",
    frameRate: 8,
    frameBuffer: 8,
    loop: true,
    autoplay: false,
    opacity: 0,
  }),
  new Sprite({
    position: {
      x: 257,
      y: 320,
    },
    imageSrc: "./img/Objects/Furnace/Furnace.png",
    frameRate: 8,
    frameBuffer: 7,
    loop: true,
    autoplay: false,
    opacity: 0,
  }),
];

//Chest
const Chests = [
  new Sprite({
    position: {
      x: 448,
      y: 341,
    },
    imageSrc: "./img/Objects/Chest/DualChestOpening.png",
    frameRate: 14,
    frameBuffer: 3,
    loop: false,
    autoplay: false,
    opacity: 100,
    id: 1,
  }),
  new Sprite({
    position: {
      x: 448,
      y: 341,
    },
    imageSrc: "./img/Objects/Chest/DualChestClosing.png",
    frameRate: 14,
    frameBuffer: 3,
    loop: false,
    autoplay: false,
    opacity: 0,
    id: 2,
  }),
];

//Bed
const Beds = [
  new Sprite({
    position: {
      x: 2,
      y: 380,
    },
    imageSrc: "./img/Objects/Bed/Bed.png",
    frameRate: 2,
    frameBuffer: 1,
    loop: false,
    autoplay: false,
    opacity: 100,
  }),
];

const Tutorial = [
  new Sprite({
    position: {
      x: 600,
      y: 320,
    },
    imageSrc: "./img/NPC/Caire/Caire.png",
    frameRate: 28,
    frameBuffer: 29,
    autoplay: true,
    opacity: 100,
  }),
];

//Background
const backgroundHouseStart = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background/HomeBC.png",
});

const backgroundImageHeight = 576;

//----------------------------------------------------------------//
//GERAL RULES

//Gravity
const gravity = 0.5;

//Keys
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },

  v: {
    pressed: false,
  },

  w: {
    pressed: false,
  },

  Space: {
    pressed: false,
  },
};

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

//----------------------------------------------------------------//
//ANIMATION

//Black Transition Next Level
const overlay = {
  opacity: 0,
};

//Animation Loop
function animate() {
  //???
  window.requestAnimationFrame(animate);
  c.save();
  c.translate(camera.position.x, camera.position.y);

  backgroundHouseStart.update();

  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  //Animate Objects
  //animate door
  doors.forEach((door) => {
    door.update(); // Animate door sprites
  });

  //Animate Furnace
  Furnaces.forEach((Furnace) => {
    Furnace.update(); // Animate furnace sprites
  });

  //Animate Tutorials
  Tutorial.forEach((Tutorial) => {
    Tutorial.update();
  });

  //Animate Chest
  Chests.forEach((Chest) => {
    Chest.update(); // Animate Chest sprites
  });

  //Animate Bed
  Beds.forEach((Bed) => {
    Bed.update(); // Animate Bed sprites
  });

  player.update();

  player.handleInput(keys);
  c.restore();

  player.checkForHorizontalCanvasCollision();

  //Black Transition Next Level animation
  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

animate();

let FirstFurnaceActive = false;
let SecondFurnaceActive = false;
let Furance0Active = false;
let Furance1Active = false;

let ChestOpened1 = false;
let ChestOpened2 = false;

//When Key is pressed
window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  if (event.repeat) return;

  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;

    case "a":
      keys.a.pressed = true;
      break;

    case "w":
      if (player.velocity.y === 0) player.velocity.y = -10;

      break;

    case "v":
      keys.v.pressed = true;
      break;

    case " ":
      for (let i = 0; i < Tutorial.length; i++) {
        const Tutorials = Tutorial[i];

        //Interagir com NPC Cairé
        if (
          player.hitbox.position.x <= Tutorials.position.x + Tutorials.width &&
          player.hitbox.position.x + player.hitbox.width >=
            Tutorials.position.x &&
          player.hitbox.position.y + player.hitbox.height >=
            Tutorials.position.y &&
          player.hitbox.position.y <= Tutorials.position.y + Tutorials.height
        ) {
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
            "./img/Objects/Talks/TalkCaire6.png",
          ];

          var currentImageIndex = 0;

          // Atualiza a imagem exibida
          function updateImage(index) {
            talk.style.backgroundImage = `url('${images[index]}')`;
          }

          // Fecha o diálogo
          function hideTalk() {
            overlayTalk.style.display = "none";
            currentImageIndex = 0; // Reinicia o índice para a primeira imagem
            updateImage(currentImageIndex);
          }

          closeButton.addEventListener("click", hideTalk);

          nextButton.addEventListener("click", function () {
            if (currentImageIndex < images.length - 1) {
              currentImageIndex++;
              updateImage(currentImageIndex);
            } else {
              hideTalk();
            }
          });

          // Mostra o diálogo
          overlayTalk.style.display = "flex";
          overlayTalk.style.zIndex = "99999";
          talk.style.display = "flex";
          updateImage(currentImageIndex);
        }
      }

      //Interagir com as Fornalhas
      const Furnace = Furnaces;
      if (
        FirstFurnaceActive === true &&
        player.hitbox.position.x <= Furnace[0].position.x + Furnace[0].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Furnace[0].position.x &&
        player.hitbox.position.y + player.hitbox.height >=
          Furnace[0].position.y &&
        player.hitbox.position.y <= Furnace[0].position.y + Furnace[0].height
      ) {
        if (Furance0Active === false) {
          Furnace[0].play();
          Furnace[0].opacity = 0;
          Furance0Active = true;
          FirstFurnaceActive = true;
        } else {
          Furnace[3].play();
          Furnace[3].opacity = 0;
          FirstFurnaceActive = false;
          Furance0Active = false;
        }
        return;
      } else if (
        player.hitbox.position.x <= Furnace[0].position.x + Furnace[0].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Furnace[0].position.x &&
        player.hitbox.position.y + player.hitbox.height >=
          Furnace[0].position.y &&
        player.hitbox.position.y <= Furnace[0].position.y + Furnace[0].height
      ) {
        if (!Furance0Active) {
          Furnace[0].play();
          Furnace[0].opacity = 100;
          Furance0Active = true;
        } else {
          Furnace[3].play();
          Furnace[3].opacity = 100;
          FirstFurnaceActive = true;
          Furance0Active = false;
        }
        return;
      }

      if (
        SecondFurnaceActive === true &&
        player.hitbox.position.x <= Furnace[1].position.x + Furnace[1].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Furnace[1].position.x &&
        player.hitbox.position.y + player.hitbox.height >=
          Furnace[1].position.y &&
        player.hitbox.position.y <= Furnace[1].position.y + Furnace[1].height
      ) {
        if (Furance1Active === false) {
          Furnace[1].play();
          Furnace[1].opacity = 0;
          Furance1Active = true;
          SecondFurnaceActive = true;
        } else {
          Furnace[2].play();
          Furnace[2].opacity = 0;
          SecondFurnaceActive = false;
          Furance1Active = false;
        }
        return;
      } else if (
        player.hitbox.position.x <= Furnace[1].position.x + Furnace[1].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Furnace[1].position.x &&
        player.hitbox.position.y + player.hitbox.height >=
          Furnace[1].position.y &&
        player.hitbox.position.y <= Furnace[1].position.y + Furnace[1].height
      ) {
        if (!Furance1Active) {
          Furnace[1].play();
          Furnace[1].opacity = 100;
          Furance1Active = true;
        } else {
          Furnace[2].play();
          Furnace[2].opacity = 100;
          SecondFurnaceActive = true;
          Furance1Active = false;
        }
        return;
      }

      //Interagir com as Portas
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];
        if (
          player.hitbox.position.x <= door.position.x + door.width &&
          player.hitbox.position.x + player.hitbox.width >= door.position.x &&
          player.hitbox.position.y + player.hitbox.height >= door.position.y &&
          player.hitbox.position.y <= door.position.y + door.height
        ) {
          player.preventInput = true;
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.switchSprite("EnterDoor");
          player.enteringDoor = true;
          door.play();

          return;
        }
      }

      for (let i = 0; i < Chests.length; i++) {
        const Chest = Chests[i];
        if (
          player.hitbox.position.x <= Chest.position.x + Chest.width &&
          player.hitbox.position.x + player.hitbox.width >= Chest.position.x &&
          player.hitbox.position.y + player.hitbox.height >= Chest.position.y &&
          player.hitbox.position.y <= Chest.position.y + Chest.height
        ) {
          if (Chest.id === 1) {
            if (!ChestOpened1) {
              Chest.opacity = 100; // Baú fica opaco quando aberto
              ChestOpened1 = true;
              console.log("Chest 1 aberto");
              Chest.play();
            } else {
              Chest.opacity = 0; // Baú fica transparente quando fechado
              ChestOpened1 = false;
              console.log("Chest 1 fechado");
              Chest.play();
            }
          } else if (Chest.id === 2) {
            if (!ChestOpened2) {
              Chest.opacity = 0; // Baú fica opaco quando aberto
              ChestOpened2 = true;
              console.log("Chest 2 aberto");
              Chest.play();
            } else {
              Chest.opacity = 100; // Baú fica transparente quando fechado
              ChestOpened2 = false;
              console.log("Chest 2 fechado");
              Chest.play();
            }
          }
        }
      }

      for (let i = 0; i < Beds.length; i++) {
        const Bed = Beds[i];
        if (
          player.hitbox.position.x <= Bed.position.x + Bed.width &&
          player.hitbox.position.x + player.hitbox.width >= Bed.position.x &&
          player.hitbox.position.y + player.hitbox.height >= Bed.position.y &&
          player.hitbox.position.y <= Bed.position.y + Bed.height
        ) {
          player.preventInput = true;
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.opacity = 0;
          player.switchSprite("Sleep");
          Bed.play();
          console.log("aba");
        }
      }
      break;
  }

  event.preventDefault();
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "v":
      keys.v.pressed = false;
      break;
  }
});
