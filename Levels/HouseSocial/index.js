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
var saiuHouse = sessionStorage.getItem("saiuHouse")
var entrouHouse = sessionStorage.getItem("entrouHouse")

const player = new Player({
  position: entrouHouse==="true"?{
    x: 836,
    y: 320,
  }
  :
  {
    x:820,
    y:320
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
        sessionStorage.setItem("saiuHouse", "social");

        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            window.location.href = "../VillageSecond/index.html";
            gsap.to(overlay, {
              opacity: 0,
            });
          },
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

const Frames = [
  new Sprite({
    position: {
      x: 61,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame1.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 189,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame2.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 320,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame3.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 448,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame4.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 573,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame5.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 704,
      y: 256,
    },
    imageSrc: "./img/Objects/Frames/frame6.png",
    frameRate: 1,
    frameBuffer: 1,
    opacity: 100,
  }),
];

//Background
const backgroundHouseStart = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background/HomeBC-Recovered.png",
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
  D: {
    pressed: false,
  },
  A: {
    pressed: false,
  },

  V: {
    pressed: false,
  },

  W: {
    pressed: false,
  },

  Space: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },

  ArrowUp: {
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

  //Appear Frames
  Frames.forEach((Frames) =>{
    Frames.update()
  })

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

//When Key is pressed
window.addEventListener("keydown", async (event) => {
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

      case "D":
      keys.d.pressed = true;
      break;

    case "A":
      keys.a.pressed = true;
      break;

    case "W":
      if (player.velocity.y === 0) player.velocity.y = -10;
      break;

    case "V":
      keys.v.pressed = true;
      break;

    case "ArrowRight":
      keys.d.pressed = true;
      break;

      case "ArrowUp":
        if (player.velocity.y === 0) player.velocity.y = -10;
        break;

        case "ArrowLeft": 
        keys.a.pressed = true;
        break;

    case " ":
      const Frame = Frames;
      if (
        player.hitbox.position.x <= Frame[0].position.x + Frame[0].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[0].position.x &&
        player.hitbox.position.y -20 + player.hitbox.height >=
          Frame[0].position.y -20 &&
        player.hitbox.position.y -20 <= Frame[0].position.y + Frame[0].height 
      ) { 
        window.open('https://www.linkedin.com/in/caire-maia/', '_blank')
          console.log("quadro1");
        return;
      }
      if (
        player.hitbox.position.x <= Frame[1].position.x + Frame[1].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[1].position.x &&
        player.hitbox.position.y -20 + player.hitbox.height >=
          Frame[1].position.y -20 &&
        player.hitbox.position.y  -20<= Frame[1].position.y + Frame[1].height
      ) { 
        window.open('https://github.com/Ximbeh', '_blank')
          console.log("quadro2");
        return;
      }
      if (
        player.hitbox.position.x <= Frame[2].position.x + Frame[2].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[2].position.x &&
        player.hitbox.position.y -20 + player.hitbox.height >=
          Frame[2].position.y -20 &&
        player.hitbox.position.y -20 <= Frame[2].position.y + Frame[2].height
      ) {
        window.open('https://wa.me/5548998537457', '_blank')
          console.log("quadro3");
        return;
      }
      if (
        player.hitbox.position.x <= Frame[3].position.x + Frame[3].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[3].position.x &&
        player.hitbox.position.y -20 + player.hitbox.height >=
          Frame[3].position.y  -20&&
        player.hitbox.position.y -20 <= Frame[3].position.y + Frame[3].height
      ) {
        window.open('https://twitter.com/Ximb2005', '_blank')
          console.log("quadro4");
        return;
      }
      if (
        player.hitbox.position.x <= Frame[4].position.x + Frame[4].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[4].position.x &&
        player.hitbox.position.y  -20+ player.hitbox.height >=
          Frame[4].position.y  -20&&
        player.hitbox.position.y -20 <= Frame[4].position.y + Frame[4].height
      ) {
        window.open('https://www.instagram.com/ximb2005/', '_blank')
          console.log("quadro4");
        return;
      }
      if (
        player.hitbox.position.x <= Frame[5].position.x + Frame[5].width &&
        player.hitbox.position.x + player.hitbox.width >=
          Frame[5].position.x &&
        player.hitbox.position.y -20 + player.hitbox.height >=
          Frame[5].position.y  -20&&
        player.hitbox.position.y  -20 <= Frame[5].position.y + Frame[5].height
      ) {
        try {
          await navigator.clipboard.writeText("Ximb#7167");
          console.log("Conteudo copiado");
        } catch (err){
          console.error('Falha ao copiar: ', err);
        }
          console.log("quadro5");
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

      case "D":
        keys.d.pressed = false;
        break;
  
      case "A":
        keys.a.pressed = false;
        break;
  
      case "V":
        keys.v.pressed = false;
        break;

        case "ArrowRight":
      keys.d.pressed = false;
      break;

      

        case "ArrowLeft": 
        keys.a.pressed = false;
        break;
  }
});
