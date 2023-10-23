const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//Canva Size
canvas.width = 1024;
canvas.height = 576;

// 3072
// 895
const scaledCanvas = {
  width: canvas.width,
  height: canvas.height
}

//----------------------------------------------------------------//

//Array of the collision in a new ARRAY
const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 96) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 96))
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !=0) {
      console.log('aaa');
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

const gravity = 0.5

//----------------------------------------------------------------//
//NEW ITENS

//Players
var proximaFase = sessionStorage.getItem("proximaFase")

const player = new Player({
  position: proximaFase==="florestaTresParaFlorestaQuatro"?{
    x: 2,
    y: 200,
  }
  : proximaFase = "florestaCincoParaFlorestaQuatro"?{
    x: 940,
    y: 320,
  }
  :
  {
    x:200,
    y:320
  },
  //VVV  mesma coisa que collisionBlocks: collisionBlocks VVV
  collisionBlocks,
  imageSrc: "./img/Steve/Respiração.png",
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
    NextLevel: {
      imageSrc: "./img/Steve/RunRight.png",
      frameRate: 34,
      frameBuffer: 2,
      loop: false,
      onComplete: () => {
        console.log("proximo nivel");
        sessionStorage.setItem("proximaFase", "florestaQuatroParaFlorestaCinco")
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            window.location.href = '../ForestFifth/index.html';
            gsap.to(overlay, {
                opacity: 0,
            })
          }
        });
      },
    },
    BackLevel: {
      imageSrc: "./img/Steve/Run.png",
      frameRate: 34,
      frameBuffer: 2,
      loop: false,
      onComplete: () => {
        console.log("voltar nivel");
        sessionStorage.setItem("proximaFase", "florestaQuatroParaFlorestaTres")
        // player.lastDirection = "left";
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            window.location.href = '../VillageThird/index.html';
            gsap.to(overlay, {
                opacity: 0,
            })
          }
        });
      },
    },
  },
})


//Default keys position (Not pressed)
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

//Background definition
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background/BackgroundVillage.png",
})

const backgroundImageHeight = 576

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

//Animation (loop)
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.translate(camera.position.x, camera.position.y)
  background.update()
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update()
   
  })

 
  player.checkForHorizontalCanvasCollision()

  //Animate Objects

  player.update()

  player.velocity.x = 0;
    //Right
    if (keys.d.pressed && player.enteringDoor === false && !player.nextingLevel) {
      player.switchSprite("RunRight");
      player.velocity.x = 5; 
      player.lastDirection = "right";
      
    }

    //Left
    else if (keys.a.pressed && player.enteringDoor === false && !player.nextingLevel) {
      player.switchSprite("Run");
      player.velocity.x = -5;
      player.lastDirection = "left";
     
    }

    //Stoped
    
    else if (player.velocity.y === 0 && !player.enteringDoor && !player.nextingLevel) {
      if (player.lastDirection === "left") player.switchSprite("Stoped");
      else player.switchSprite("StopedRight");
    }

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

  c.restore()

  //Black Transition Next Level animation
  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}



animate()

//When Key is pressed
window.addEventListener('keydown', (event) => {
  if (player.preventInput) return;
  if (event.repeat) return;

  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case "w":
      if (player.velocity.y === 0) player.velocity.y = -10;

      break;

      case "v":
      keys.v.pressed = true;
      break;
  }
  event.preventDefault();
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break

      case "v":
      keys.v.pressed = false;
      break;
  }
})