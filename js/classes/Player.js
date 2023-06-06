class Player extends Sprite {
    constructor({position, collisionBlocks, imageSrc, animations}){
        const frameRate = animations.Stoped.frameRate; 
        super({imageSrc, frameRate})
        this.position = position
        this.velocity = {
            x: 0,
            y: 1,
        }
        // this.height = 72
        // this.width = 48
        this.collisionBlocks = collisionBlocks

        
        

        this.animations = animations
        this.lastDirection = 'left'

        for (let key in this.animations){
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

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        this.currentFrame = 0
        this.image = this.animations[key].image;
        this.frameRate = this.animations[key].frameRate; // Update the frameRate dynamically
        this.frameBuffer = this.animations[key].frameBuffer;
    }


   

    update(){
        this.updateFrames()
        this.updateHitbox()
        this.updateCamerabox()
        
        //hitbox do background
        // c.fillStyle = 'rgba(0,255,0, 0.5)'
        // c.fillRect(this. camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)
        
        //hitbox da imagem
        // c.fillStyle = 'rgba(0,0,255, 0.5)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)


        // c.fillStyle = 'rgba(255,0,0, 0.5)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.draw()
        
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.apllyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
        
        
    }

    updateHitbox(){
        this.hitbox = {
            position: {
                x: this.position.x + 17,
                y: this.position.y + 3,
            },
            width: 60,
            height: 125
        }
    }

    updateCamerabox(){
        this.camerabox = {
            position: {
                x: this.position.x - 250,
                y: this.position.y,
            },
            width: 600,
            height: 263,
        }
    }

    checkForHorizontalCanvasCollision(){
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= canvas.width || 
            this.hitbox.position.x + this.velocity.x <= 0
        ) {
            this.velocity.x = 0
            console.log("aaaaaaaa");
        }
    }

    shouldPanCameraToTheLeft({canvas, camera}){
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width


        if(cameraboxRightSide >= 1024) return
        // if(cameraboxRightSide >= canvas.width) return

        if(cameraboxRightSide >= canvas.width +  Math.abs(  camera.position.x)){
           camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraToTheRight({canvas, camera}){
        if (this.camerabox.position.x <= 0) return

        if(this.camerabox.position.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraDown({canvas, camera}){
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if(this.camerabox.position.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({canvas, camera}){
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 576) return

        if(this.camerabox.position.y + this.camerabox.height >= 
            Math.abs(camera.position.y) + canvas.height 
        ){
            camera.position.y -= this.velocity.y
        }
    }


    checkForHorizontalCollisions(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]

                if (
                    collision({
                        object1: this.hitbox,
                        object2: collisionBlock,    
                    })
                ){
                if (this.velocity.x > 0){
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
                if (this.velocity.x < 0){
                    this.velocity.x = 0

                    

                    this.position.x = 
                        collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }

            
                }
        }
    }



    apllyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
        
    }

    checkForVerticalCollisions(){
        for(let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]

                if (
                    collision({
                        object1: this.hitbox,
                        object2: collisionBlock,    
                    })
                ){
                if (this.velocity.y > 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }
                

            
                }
        }
    }

    
}