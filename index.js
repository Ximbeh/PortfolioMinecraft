const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//tamanho canva
canvas.width = 1024
canvas.height = 576
//576

const scaledCanvas = {
    width: canvas.width,
    height: canvas.height,
}

const floorCollision2D = []
for (let i = 0; i < floorCollisions.length; i += 32) {
  floorCollision2D.push(floorCollisions.slice(i, i + 64))
}


const collisionBlocks = []

floorCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol != 0){
            // console.log('aaa');
            collisionBlocks.push(
                new CollisionBlock({
                  position: {
                    x: x * 32,
                    y: y * 32,
                  },
                })
              )
            }
          })
        })
// console.log(collisionBlocks);

//global
const gravity = 0.5

const player = new Player({
    position: {
        x:100,
        y:300,
    },
    collisionBlocks,
    imageSrc: './img/Steve/Respiração.png',
    // mesma coisa que collisionBlocks: collisionBlocks,
    animations: {
        Stoped: {
            imageSrc: './img/Steve/Respiração.png',
            frameRate: 28, 
            frameBuffer: 24
        },  
        StopedRight: {
            imageSrc: './img/Steve/RespiraçãoRight.png',
            frameRate: 28, 
            frameBuffer: 24
        }, 
        Run: {
            imageSrc: './img/Steve/Run.png',
            frameRate: 34, 
            frameBuffer: 2  
        },
        RunRight: {
            imageSrc: './img/Steve/RunRight.png',
            frameRate: 34, 
            frameBuffer: 2  
        },
        Jump: {
            imageSrc: './img/Steve/Jump.png',
            frameRate: 1, 
            frameBuffer: 1 
        },
        JumpRight: {
            imageSrc: './img/Steve/JumpRight.png',
            frameRate: 1, 
            frameBuffer: 1 
        },
    }

})

//teclas
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
        pressed: false
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/BackgroundTest/HomeBC.png'
})

const backgroundImageHeight = 576

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    }
}

//Loop de animação 

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle ='white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.translate(camera.position.x, camera.position.y ) 
    
    background.update()
    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.update()
    })
    
    

    player.update()

    player.velocity.x = 0



    //Right
    if (keys.d.pressed) {
        player.switchSprite('RunRight')
        player.velocity.x = 5
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({canvas, camera})
    }

    //Left
    else if (keys.a.pressed) {
        player.switchSprite('Run')
        player.velocity.x = -5;
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({canvas, camera})
    }

    //Stoped
    else if (player.velocity.y === 0) {

        if (player.lastDirection === 'left') player.switchSprite('Stoped')
        else player.switchSprite('StopedRight')
    }


    //Jump
    //Move the camera
    if (player.velocity.y < 0) player.shouldPanCameraDown({canvas, camera})
    else if (player.velocity.y > 0) player.shouldPanCameraUp({canvas, camera})

    //Move the player
    if ((player.velocity.y < 0 || player.velocity.y > 0) && player.velocity.x < 0 )
        player.switchSprite('Jump') 
    

    else if ((player.velocity.y < 0 || player.velocity.y > 0) && player.velocity.x > 0 ) player.switchSprite('JumpRight')


    //Boost (BUGADO)
    // if (keys.v.pressed) {
    //     player.animations.Run.frameBuffer = 1;
    //     player.animations.RunRight.frameBuffer = 1
    //     if (keys.d.pressed) player.velocity.x = 8;
    //     else if (keys.a.pressed) player.velocity.x = -8;
    // }
    // else if (player.animations.Run.frameBuffer = 2, player.animations.RunRight.frameBuffer = 2)


    c.restore()

    player.checkForHorizontalCanvasCollision()
    
}

animate()

//movimentação
window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    switch(event.key){
        case 'd':
            keys.d.pressed = true;
        break

        case 'a':
            keys.a.pressed = true
        break

        case 'w':
                player.velocity.y = -10
        break

        case 'v':
            keys.v.pressed = true
        break

       
    }

    event.preventDefault();
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
        break

        case 'a':
            keys.a.pressed = false
        break

        case 'v':
            keys.v.pressed = false
        break


       
    }
})
