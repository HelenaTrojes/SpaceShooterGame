import { ctx, canvas } from "./canvasLayer.js";
import { Invader } from "./invader.js";

export class Grid {
    // Constructor => initializes the grid with a random number of columns and rows
    constructor() {
        this.invaders = [];   // Create an array to store invaders
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: 3,
            y: 0
        };

        this.invaders = [];  // Generate invaders

        const columns = Math.floor(Math.random() * 4 + 5);
        const rows = Math.floor(Math.random() * 2 + 3);
        this.width = columns * 30;
        for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Create a new invader and add it to the invaders array
            this.invaders.push(new Invader({position: {
                x: x * 30,
                y: y * 30
            },
            imageSrc: './images/enemy.png',
            scale: 0.2,
            framesMax: 7
        }));
        }
    }
    console.log(this.invaders);
    }

    // Update the position of the grid based on its velocity
    update() {
     this.position.x += this.velocity.x;
     this.position.y += this.velocity.y;
     this.velocity.y = 0 ;

     // If the grid touches the canvas, reverse its direction.
     if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 30;
     }
    }

    draw(){
        this.invaders.forEach(invader => invader.draw());
    }
};