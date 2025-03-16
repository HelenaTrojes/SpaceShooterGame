import { canvas, ctx} from "./canvasLayer.js";
import { GameObject } from "./gameObject.js";
import { keys } from "./main.js";


export class Player extends GameObject{
    constructor(x, y, width, height, imgSrc) {
        super(x, y, width, height, imgSrc);
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0

        this.opacity = 1;
        const image = new Image();
        image.src = './images/spaceshipSprite.png';
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width /2,
                y: canvas.height - this.height -20
            }
        }
        this.frameWidth = 200;
        this.frameHeight = 100;
        this.currentFrame = 0;
        this.maxFrames = 3;
        this.spriteRows = 2;
        
    }

    draw() {
        ctx.save();
        // Translate (specify the amount to displace objects) the canvas to the center of the player
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        // glovalAlpha -> returns the transparency value of the context
        ctx.globalAlpha = this.opacity;

        // Set the x coordinate of the frame based on the current frame
        let frameX = this.currentFrame * this.frameWidth;
        // Set the y coordinate of the frame based on the row of the sprite sheet
        let frameY = 0;

        if (keys.a.pressed) {
            frameY = 0; // First row for turning left
        } else if (keys.d.pressed) {
            frameY = this.frameHeight; // Second row for turning right
        }

        
        if(this.image) {
            ctx.drawImage(this.image, frameX, frameY, this.frameWidth, this.frameHeight, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }

    update() {
        if(this.image) {
        this.draw();
        this.position.x += this.velocity.x;

        // Update frame for animation if moving left or right
        if (keys.a.pressed || keys.d.pressed) {
            // Increment the current frame by 1. Reset to the first frame when the current frame = maximum number of frames
            this.currentFrame = (this.currentFrame + 1) % this.maxFrames;
        } else {
            // Reset to the first frame/0 when keys not pressed
            this.currentFrame = 0;
        }
    }
}
};