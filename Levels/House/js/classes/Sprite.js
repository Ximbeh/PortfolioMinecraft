
class Sprite{
    constructor ({
        position, 
        imageSrc, 
        frameRate = 1, 
        frameBuffer = 0,
        loop = true, 
        autoplay = true,
        opacity = 100,
        id = 0,
    }){
        this.position = position
        this.loaded = false
        this.image = new Image()
        this.image.onload = () => {
            this.width = this.image.width / this.frameRate,
            this.height = this.image.height
            this.loaded = true
        }
        this.image.src = imageSrc   
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0
        this.loop = loop
        this.autoplay = autoplay
        this.opacity = opacity
        this.currentAnimation
        this.id = id
    }

    draw(){
        if (!this.loaded) return

        const cropbox = {
            position: {
              x: this.currentFrame * (this.image.width / this.frameRate),
              y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
          }

          c.save()
          c.globalAlpha = this.opacity / 100;
        
        // console.log(cropbox.position.x);
        // console.log(cropbox.position.this.currentFrame);
        // console.log(cropbox.position.this.image.width);
        // console.log(cropbox.position.this.frameRate);

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
    }

    update(){
        this.draw()
        this.updateFrames()
    }

    play(){
        this.autoplay = true
    }

    

    updateFrames(){
        if (!this.autoplay) return 

        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1)
            this.currentFrame++
            else if (this.loop) this.currentFrame = 0
        }

        if (this.currentAnimation?.onComplete){
            if (this.currentFrame === this.frameRate -1 && !this.currentAnimation.isActive){
                this.currentAnimation.onComplete()
                this.currentAnimation.isActive = true
            }
        }
    }
}