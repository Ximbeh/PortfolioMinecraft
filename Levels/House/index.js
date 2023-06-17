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
    x: 100,
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
            window.location.href = '../Village/index.html';
            gsap.to(overlay, {
                opacity: 0,
            })
          }
        });
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
  }
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

  //animate Furnace
  Furnaces.forEach((Furnace) => {
    Furnace.update(); // Animate furnace sprites
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

let Furance0Active = false
let Furance1Active = false

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
        const Furnace = Furnaces;

        if (
          player.hitbox.position.x <= Furnace[0].position.x + Furnace[0].width &&
          player.hitbox.position.x + player.hitbox.width >= Furnace[0].position.x &&
          player.hitbox.position.y + player.hitbox.height >= Furnace[0].position.y &&
          player.hitbox.position.y <= Furnace[0].position.y + Furnace[0].height
        ) {
          if (!Furance0Active) {
            Furnace[0].play();
            Furnace[0].opacity = 100;
            Furance0Active = true;
          } else {
            Furnace[3].play();
            Furnace[3].opacity = 100;
            // Furance0Active = false;
          }
          return;
        } 


        if (
          player.hitbox.position.x <= Furnace[1].position.x + Furnace[1].width &&
          player.hitbox.position.x + player.hitbox.width >= Furnace[1].position.x &&
          player.hitbox.position.y + player.hitbox.height >= Furnace[1].position.y &&
          player.hitbox.position.y <= Furnace[1].position.y + Furnace[1].height
        ) {
          if (!Furance1Active) {
            Furnace[1].play();
            Furnace[1].opacity = 100;
            Furance1Active = true;
          } else {
            Furnace[2].play();
            Furnace[2].opacity = 100;
            // Furance1Active = false;
          }
          return;
        }

        
  

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
