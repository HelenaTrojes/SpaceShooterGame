import { ctx } from "./canvasLayer.js";
import { GameObject } from "./gameObject.js";

export class Particle extends GameObject{
    constructor({position, velocity, radius, color, fades}){
        super(position, velocity, radius, color, fades);
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }
    draw(){
            // Save the current canvas state
        ctx.save();
           // Set the global alpha of the canvas to the opacity of the particle
        ctx.globalAlpha = this.opacity;  
        ctx.beginPath();
          // Draw a circle with the radius of the particle at its position
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    update () {
        this.draw(ctx);
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

     // If the fades property of the particle is true -> decrement the opacity of the particle
        if (this.fades){ 
            this.opacity -= 0.01;
        }
    }
};