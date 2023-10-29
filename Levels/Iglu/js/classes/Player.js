class Player extends Sprite {
    constructor({ position, collisionBlocks, imageSrc, animations, loop, opacity = 100, }) {
      const frameRate = animations.Stoped.frameRate;
      super({ imageSrc, frameRate, loop });
      this.position = position;
      this.velocity = {
        x: 0,
        y: 1,
      };
      // this.height = 72
      // this.width = 48
      this.collisionBlocks = collisionBlocks;
      this.animations = animations;
      this.lastDirection = "left";
      this.enteringDoor = false;
      this.opacity = opacity
  
      for (let key in this.animations) {
        const image = new Image();
        image.src = this.animations[key].imageSrc;
  
        this.animations[key].image = image;
      }
  
      this.camerabox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        width: 200,
        height: 80,
      };
    }
    opacityDraw (){
      c.save()
      c.globalAlpha = this.opacity / 100;
    }
    //KEYS ANIMATION
    handleInput(keys) {
      this.velocity.x = 0;
      //Right
      if (keys.d.pressed && this.enteringDoor === false) {
        this.switchSprite("RunRight");
        this.velocity.x = 5;
        this.lastDirection = "right";
        this.shouldPanCameraToTheLeft({ canvas, camera });
      }
  
      //Left
      else if (keys.a.pressed && this.enteringDoor === false) {
        this.switchSprite("Run");
        this.velocity.x = -5;
        this.lastDirection = "left";
        this.shouldPanCameraToTheRight({ canvas, camera });
      }
  
      //Stoped
      else if (this.velocity.y === 0 && !this.enteringDoor) {
        if (this.lastDirection === "left") this.switchSprite("Stoped");
        else this.switchSprite("StopedRight");
      }
  
      //Jump
      //Move the camera
      if (this.velocity.y < 0) this.shouldPanCameraDown({ canvas, camera });
      else if (this.velocity.y > 0) this.shouldPanCameraUp({ canvas, camera });
  
      //Move the this
      if ((this.velocity.y < 0 || this.velocity.y > 0) && this.velocity.x < 0)
        this.switchSprite("Jump");
      else if (
        (this.velocity.y < 0 || this.velocity.y > 0) &&
        this.velocity.x > 0
      )
        this.switchSprite("JumpRight");
  
      //Boost (BUG)
      // if (keys.v.pressed) {
      //     this.animations.Run.frameBuffer = 1;
      //     this.animations.RunRight.frameBuffer = 1
      //     if (keys.d.pressed) this.velocity.x = 8;
      //     else if (keys.a.pressed) this.velocity.x = -8;
      // }
      // else if (this.animations.Run.frameBuffer = 2, this.animations.RunRight.frameBuffer = 2)
    }
  
    switchSprite(key) {
      if (this.image === this.animations[key].image || !this.loaded) return;
  
      this.currentFrame = 0;
      this.image = this.animations[key].image;
      this.frameRate = this.animations[key].frameRate; // Update the frameRate dynamically
      this.frameBuffer = this.animations[key].frameBuffer;
      this.loop = this.animations[key].loop;
      this.currentAnimation = this.animations[key];
    }
  
    update() {
      this.updateFrames();
      this.updateHitbox();
      this.updateCamerabox();
  
      //hitbox do background
      // c.fillStyle = 'rgba(0,255,0, 0.5)'
      // c.fillRect(this. camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)
  
      //hitbox da imagem
      // c.fillStyle = 'rgba(0,0,255, 0.5)'
      // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  
      // c.fillStyle = 'rgba(255,0,0, 0.5)'
      // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
  
      this.draw();
      this.opacityDraw();
      
  
      this.position.x += this.velocity.x;
      this.updateHitbox();
      this.checkForHorizontalCollisions();
      this.apllyGravity();
      this.updateHitbox();
      this.checkForVerticalCollisions();
    }
  
    updateHitbox() {
      this.hitbox = {
        position: {
          x: this.position.x + 17,
          y: this.position.y + 3,
        },
        width: 60,
        height: 125,
      };
    }
  
    updateCamerabox() {
      this.camerabox = {
        position: {
          x: this.position.x - 250,
          y: this.position.y,
        },
        width: 600,
        height: 263,
      };
    }
  
    checkForHorizontalCanvasCollision() {
      if (
        this.hitbox.position.x + this.hitbox.width + this.velocity.x >=
          canvas.width ||
        this.hitbox.position.x + this.velocity.x <= 0
      ) {
        this.velocity.x = 0;
        console.log("aaaaaaaa");
      }
    }
  
    shouldPanCameraToTheLeft({ canvas, camera }) {
      const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
  
      if (cameraboxRightSide >= 1024) return;
      // if(cameraboxRightSide >= canvas.width) return
  
      if (cameraboxRightSide >= canvas.width + Math.abs(camera.position.x)) {
        camera.position.x -= this.velocity.x;
      }
    }
  
    shouldPanCameraToTheRight({ canvas, camera }) {
      if (this.camerabox.position.x <= 0) return;
  
      if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
        camera.position.x -= this.velocity.x;
      }
    }
  
    shouldPanCameraDown({ canvas, camera }) {
      if (this.camerabox.position.y + this.velocity.y <= 0) return;
  
      if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
        camera.position.y -= this.velocity.y;
      }
    }
  
    shouldPanCameraUp({ canvas, camera }) {
      if (
        this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
        576
      )
        return;
  
      if (
        this.camerabox.position.y + this.camerabox.height >=
        Math.abs(camera.position.y) + canvas.height
      ) {
        camera.position.y -= this.velocity.y;
      }
    }
  
    checkForHorizontalCollisions() {
      for (let i = 0; i < this.collisionBlocks.length; i++) {
        const collisionBlock = this.collisionBlocks[i];
  
        if (
          collision({
            object1: this.hitbox,
            object2: collisionBlock,
          })
        ) {
          if (this.velocity.x > 0) {
            this.velocity.x = 0;
  
            const offset =
              this.hitbox.position.x - this.position.x + this.hitbox.width;
  
            this.position.x = collisionBlock.position.x - offset - 0.01;
            break;
          }
          if (this.velocity.x < 0) {
            this.velocity.x = 0;
  
            this.position.x = 240
            this.position.y = 350
            break;
          }
        }
      }
    }
  
    apllyGravity() {
      this.velocity.y += gravity;
      this.position.y += this.velocity.y;
    }
  
    checkForVerticalCollisions() {
      for (let i = 0; i < this.collisionBlocks.length; i++) {
        const collisionBlock = this.collisionBlocks[i];
  
        if (
          collision({
            object1: this.hitbox,
            object2: collisionBlock,
          })
        ) {
          if (this.velocity.y > 0) {
            this.velocity.y = 0;
  
            const offset =
              this.hitbox.position.y - this.position.y + this.hitbox.height;
  
            this.position.y = collisionBlock.position.y - offset - 0.01;
            break;
          }
  
          if (this.velocity.y < 0) {
            this.velocity.y = 0;
  
            const offset = this.hitbox.position.y - this.position.y;
  
            this.position.y =
              collisionBlock.position.y + collisionBlock.height - offset + 0.01;
            break;
          }
        }
      }
    }
  }
  