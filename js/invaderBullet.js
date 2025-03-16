import { ctx } from "./canvasLayer.js";
import { GameObject } from "./gameObject.js";

export class InvaderBullet extends GameObject{
    // Constructor => takes an object with properties for position and velocity
    constructor({position, velocity}){
        super(position, velocity);
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }
    draw(){
        // Draw a rectangle with the width and height of the invader bullet at its position + set fill style to white
        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update () {
        this.draw(); 
        // Update the position of the invader bullet based on its velocity
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
};