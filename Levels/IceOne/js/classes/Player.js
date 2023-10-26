class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    imageSrc,
    animations,
    loop
  }) {
    const frameRate = animations.Stoped.frameRate;
    super({ imageSrc, frameRate, loop })
    this.position = position
    this.velocity = {
      x: 0,
      y: 1,
    }
    // this.height = 72
    // this.width = 48

    this.collisionBlocks = collisionBlocks
    
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    }

    this.animations = animations
    this.lastDirection = 'right'
    this.enteringDoor = false;
    this.nextingLevel = false;

    for (let key in this.animations) {
      const image = new Image()
      image.src = this.animations[key].imageSrc

      this.animations[key].image = image
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    }
  }

  //KEYS ANIMATION

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameRate = this.animations[key].frameRate; // Update the frameRate dynamically
    this.frameBuffer = this.animations[key].frameBuffer;
    this.loop = this.animations[key].loop;
    this.currentAnimation = this.animations[key];
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x-270,
        y: this.position.y-100,
      },
      width: 600,
      height: 300,
    }
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= canvas.width ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0
      if(
        this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 1000
      ){
        console.log("direita");
        player.preventInput = true;
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.switchSprite("NextLevel");
          player.nextingLevel = true;
          
      }
      else {
        console.log("esquerda");
        player.preventInput = true;
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.switchSprite("BackLevel");
          player.nextingLevel = true;
      }
    }
  }


  update() {
    this.updateFrames()
    this.updateHitbox()

    this.updateCamerabox()
    // c.fillStyle = 'rgba(0, 0, 255, 0.2)'
    c.fillRect(
      this.camerabox.position.x,
      this.camerabox.position.y,
      this.camerabox.width,
      this.camerabox.height
    )

    // draws out the image
    // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    // c.fillStyle = 'rgba(255, 0, 0, 0.2)'
    c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    )

    this.draw()

    this.position.x += this.velocity.x
    this.updateHitbox()
    this.checkForHorizontalCollisions()
    this.applyGravity()
    this.updateHitbox()
    this.checkForVerticalCollisions()
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 17,
          y: this.position.y + 3,
      },
      width: 60,
      height: 125,
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width

          this.position.x = collisionBlock.position.x - offset - 0.01
          break
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0

          const offset = this.hitbox.position.x - this.position.x

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01
          break
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity
    this.position.y += this.velocity.y
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height

          this.position.y = collisionBlock.position.y - offset - 0.01
          break
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0

          const offset = this.hitbox.position.y - this.position.y

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01
          break
        }
      }
    }

  
  }
}