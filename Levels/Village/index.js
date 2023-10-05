const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//Canva Size
canvas.width = 1024;
canvas.height = 576;


// 3072
// 895
const scaledCanvas = {
  width: canvas.width,
  height: canvas.height,
};

//----------------------------------------------------------------//

//Array of the collision in a new ARRAY
const floorCollision2D = [];
for (let i = 0; i < CollisionVillage.length; i += 96) {
  floorCollision2D.push(CollisionVillage.slice(i, i + 96));
}

const collisionBlocks = [];
floorCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !=0) {
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
    x: 180,
    y: 320,
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
            window.location.href = '../HouseVisited/index.html';
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
      x: 196,
      y: 320,
    },
    imageSrc: "./img/Objects/Door/Door.png",
    frameRate: 4,
    frameBuffer: 6,
    loop: false,
    autoplay: false,
  }),
];


//Background
const backgroundHouseStart = new Sprite({
  position: {
    x: 0,
    y: -320,
  },
  imageSrc: "./img/Background/BackgroundVillage.png",
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
} 

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
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save();
  c.translate(camera.position.x, -backgroundImageHeight + scaledCanvas.height);
  // c.translate(camera.position.x, camera.position.y);
  

  backgroundHouseStart.update();

  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });


  //Animate Objects
  //animate door
  doors.forEach((door) => {
    door.update(); // Animate door sprites
  });

  
  // player.checkForHorizontalCanvasCollision();
  player.update();

    player.velocity.x = 0;
    //Right
    if (keys.d.pressed && player.enteringDoor === false) {
      player.switchSprite("RunRight");
      player.velocity.x = 5; 
      player.lastDirection = "right";
      player.shouldPanCameraToTheLeft();
    }

    //Left
    else if (keys.a.pressed && player.enteringDoor === false) {
      player.switchSprite("Run");
      player.velocity.x = -5;
      player.lastDirection = "left";
      // player.shouldPanCameraToTheRight({ canvas, camera });
    }

    //Stoped
    
    else if (player.velocity.y === 0 && !player.enteringDoor) {
      if (player.lastDirection === "left") player.switchSprite("Stoped");
      else player.switchSprite("StopedRight");
    }

    //Jump
    //Move the camera
    // if (player.velocity.y < 0) player.shouldPanCameraDown({ canvas, camera });
    // else if (player.velocity.y > 0) player.shouldPanCameraUp({ canvas, camera });

    //Move the player
    if ((player.velocity.y < 0 || player.velocity.y > 0) && player.velocity.x < 0)
      player.switchSprite("Jump");
    else if (
      (player.velocity.y < 0 || player.velocity.y > 0) &&
      player.velocity.x > 0
    )
      player.switchSprite("JumpRight");

    //Boost (BUG)
    // if (keys.v.pressed) {
    //     player.animations.Run.frameBuffer = 1;
    //     player.animations.RunRight.frameBuffer = 1
    //     if (keys.d.pressed) player.velocity.x = 8;
    //     else if (keys.a.pressed) player.velocity.x = -8;
    // }
    // else if (player.animations.Run.frameBuffer = 2, player.animations.RunRight.frameBuffer = 2)


  c.restore();


  //Black Transition Next Level animation
  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

animate();

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
