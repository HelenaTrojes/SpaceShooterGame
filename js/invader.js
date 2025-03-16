import { ctx, canvas } from "./canvasLayer.js";
import { GameObject } from "./gameObject.js";
import { InvaderBullet } from "./invaderBullet.js";


export class Invader extends GameObject{
    constructor({position, imageSrc, scale = 1, framesMax = 1}) {
        super({x: position.x, y: position.y});
        this.velocity = {
            x: 0,
            y: 0
        };
        this.position = {...position};

        this.scale = scale; // Use the scale provided by the constructor
        this.framesMax = framesMax; // Total number of frames in the spritesheet
        this.frameCurrent = 0; // Current frame is 0
        this.framesElapsed = 0; // How many frames have passed to 0
        this.framesHold = 10;  // Frames to hold before changing the frame to 10

        this.image = new Image();
        this.image.onload = () => {
            const scale = 2;
            this.width = this.image.width / this.framesMax * this.scale;
            this.height = this.image.height * this.scale;
            this.position = {
                x: position.x,
                y: position.y
            }
        }
        this.image.src = './images/enemy.png';
    }

    draw() {
         // If the image and position are defined, draw the invader
        if(this.image && this.position){
        ctx.drawImage(this.image,
            this.frameCurrent * (this.image.width / this.framesMax), // Source x
            0, // Source y
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            );
        }
    }    

    update({velocity}) {
        this.framesElapsed++;  // Increment the number of frames that have passed
        // If the number of frames that have passed is divisible by the framesHold, change the frame
        if (this.framesElapsed % this.framesHold === 0) {
             // If the current frame is less than the maximum number of frames, increment the current frame
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;  // Otherwise, reset the current frame to 0
            }
        }

        if(this.image) {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        this.draw();
        }
    }

    shoot(invaderBullets){
        // Create a new InvaderBullet object and add it to the invaderBullets array
        invaderBullets.push(new InvaderBullet({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
};