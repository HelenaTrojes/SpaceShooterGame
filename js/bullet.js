import { ctx } from "./canvasLayer.js";
import { GameObject } from "./gameObject.js";

export class Bullet extends GameObject{
    constructor({position, velocity}){
        super(position, velocity);
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
    }
    draw(){
        ctx.beginPath();
         // Draw a circle with the radius of the bullet at its position
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
    // The update method updates the position of the bullet based on its velocity
    update () {
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
};