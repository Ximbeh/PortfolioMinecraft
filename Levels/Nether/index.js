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
var voltaFase = sessionStorage.getItem("voltaFase")
var entrouCaverna = sessionStorage.getItem("entrouCaverna")

const player = new Player({
  position
  : proximaFase==="cavernaSeisParaNether"?{
    x: 150,
    y: 400,
  }
  : voltaFase = "netherDoisParaNether"?{
    x: 920,
    y: 200,
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
        sessionStorage.setItem("proximaFase", "netherParaNetherDois")
        sessionStorage.setItem("saiuHouse", "false")
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            window.location.href = '../NetherSecond/index.html';
            gsap.to(overlay, {
                opacity: 0,
            })
          }
        });
      },
    },
   
   
  },
})


const PORTALS = [
  new Sprite({
    position: {
      x: 128,
      y: 255,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 192,
      y: 255,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 128,
      y: 319,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 192,
      y: 383,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 128,
      y: 383,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
  new Sprite({
    position: {
      x: 192,
      y: 319,
    },
    imageSrc: "./img/Objects/NPC/morcego.png",
    frameRate: 17,
    frameBuffer: 3,
    autoplay: true,
    opacity: 100,
  }),
];

const NPCS = [
  new Sprite({
    position: {
      x: 480,
      y: 320,
    },
    imageSrc: "./img/Objects/NPC/Jeyza.png",
    frameRate: 7,
    frameBuffer: 20,
    autoplay: true,
    opacity: 100,
  }),
];











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
    y: -4,
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
  c.fillStyle = '#22142b'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.translate(camera.position.x, camera.position.y)
  background.update()
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update()
   
  })

 
  player.checkForHorizontalCanvasCollision()

  //Animate Objects

    //animate NPC
    PORTALS.forEach((PORTAL) => {
      PORTAL.update(); // Animate NPC sprites
    });

    NPCS.forEach((NPC) => {
      NPC.update(); // Animate NPC sprites
    });

   
   



  


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

      case " ":
      case "Enter":
      case "Escape":

        for (let i = 0; i < PORTALS.length; i++) {
          const PORTAL = PORTALS[i];

          //Interagir com NPC Jaiza
          if (
            player.hitbox.position.x <= PORTAL.position.x + PORTAL.width &&
            player.hitbox.position.x + player.hitbox.width >= PORTAL.position.x &&
            player.hitbox.position.y + player.hitbox.height >= PORTAL.position.y &&
            player.hitbox.position.y <= PORTAL.position.y + PORTAL.height
          ) {
            player.opacity = 50;
            gsap.to(overlay, {
              opacity: 1,
              onComplete: () => {
                console.log("passar nivel");
                sessionStorage.setItem("proximaFase", "cavernaSeisParaNether");
                // player.lastDirection = "left";
                window.location.href = '../CavernSix/index.html';
                gsap.to(overlay, {
                  opacity: 0,
                });
              },
            });
          }
        }

        for (let i = 0; i < NPCS.length; i++) {
          const NPC = NPCS[i];
  
          //Interagir com NPC Jaiza 
          if (
            player.hitbox.position.x <= NPC.position.x + NPC.width &&
            player.hitbox.position.x + player.hitbox.width >= NPC.position.x &&
            player.hitbox.position.y + player.hitbox.height >= NPC.position.y &&
            player.hitbox.position.y <= NPC.position.y + NPC.height
          ) {
            player.opacity = 100;
            
            // Remova a animação GSAP
            
            console.log("passar nivel");
            // player.lastDirection = "left";
          
            // Abra o link em outra página
            window.open('https://www.canva.com/design/DAF1I3F7aw8/1EkFNCitpumOW7theSjSXQ/view?utm_content=DAF1I3F7aw8&utm_campaign=designshare&utm_medium=link&utm_source=editor', '_blank');
          }
        break;
        }
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