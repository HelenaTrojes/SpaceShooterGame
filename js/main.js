import { canvas, ctx, scoreEl } from "./canvasLayer.js";
import { Player } from "./player.js";
import {Bullet} from "./bullet.js";
import { Invader } from "./invader.js";
import {Particle} from "./particle.js";
import { Grid } from "./grid.js";

const player = new Player();
const bullets = [];
const grids = [new Grid()];
const invaderBullets = [];
const particles = [];
let score = 0;
let gameActive = false; // Initialize the game active flag to false

export const keys = {
    a:{ pressed : false},
    d:{ pressed : false},
    space:{ pressed : false }
};

let frames = 0;
// Initialize a random interval for spawning enemies
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
    over: false,
    active: true
}

function initGame(){
    player = new Player(); 
    bullets = [];
    grids = [new Grid()]; 
    score = 0;
    gameActive = true;
    animate();
}

// Create an array of particle objects
for (let i = 0; i < 100; i++) {    
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white',
        fades: true
    }))
};

// Function to create particles when an object is passed as an argument
function createParticles({object, color, fades}){
    for (let i = 0; i < 15; i++) {    
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#FF69B4',
            fades
        }))
    }
};

// Animation loop function
function animate() {
    if (!game.active) return; // Exit the function if the game is not active yet
    requestAnimationFrame(animate);  // Request to perfrom an animation before the next repaint
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas
    player.update();

    // Update and draw each particle
    particles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        // Check if the particle's opacity has reached zero, and if so, remove it from the array
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
        particle.update();
        }
    });

    // Update and check collisions for each invader bullet
    invaderBullets.forEach((invaderBullet, index) => {
        // If the invader bullet has moved off the canvas, remove it from the array
        if(invaderBullet.position.y + invaderBullet.height >= canvas.height) {
            setTimeout(() => {
                invaderBullets.splice(index, 1)
            }, 0)
        } else invaderBullet.update()

        // Collision detection - if bullets hit the player
        if(invaderBullet.position.y + invaderBullet.height >= player.position.y   // checks if invader bullets are at top or below the player
            && invaderBullet.position.x + invaderBullet.width >= player.position.x  // checks if the right of the invader bullet is at the right of the player
            && invaderBullet.position.x <= player.position.x + player.width) {
                console.log('you lose')
                setTimeout(() => {
                    invaderBullets.splice(index, 1)
                    player.opacity = 0;
                    game.over = true;
                    gameOver();
                    return;
                }, 0)

                 // Deactivate the game after 2 seconds
                setTimeout(() => {
                 game.active = false
                }, 2000)

            // Create particles for the player to disappear
            createParticles({   
                object: player,
                color: 'white',
                fades: true
            });
        };
    });

    // Update and check collisions for each bullet
    bullets.forEach((bullet, index) => {
        if(bullet.position.y + bullet.radius <= 0){  //checks if the bullet has moved beyond the top boundary of the canvas
            setTimeout(() => {
                bullets.splice(index, 1);
            }, 0)
        } else {
            bullet.update();
        }
    });

    // Update and check collisions for each grid of invaders
    grids.forEach((grid, gridIndex) => {
        grid.update();

        // Spawn bullets from invaders
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            // A random invader from the grid is selected to shoot bullets
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderBullets)
        };
        // Update and check collisions for each invader in the grid
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

             // Check for collisions when bullets hit player
            bullets.forEach((bullet, j) => {
                if(bullet.position.y - bullet.radius <= invader.position.y + invader.height 
                    && bullet.position.x + bullet.radius >= invader.position.x 
                    && bullet.position.x - bullet.radius <= invader.position.x + invader.width
                    && bullet.position.y + bullet.radius >= invader.position.y){
                   
                        setTimeout(()=> {
                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader);
                        const bulletFound = bullets.find((bullet2) => bullet2 === bullet);
                        // passed as argument -> the function compares each invader in the arrray with a reference invader

                        // remove invader & bullet from arrays
                        if(invaderFound && bulletFound){
                            score += 100
                            console.log (score);
                            scoreEl.innerHTML = score;
                            createParticles({   
                                object: invader,
                                fades: true
                            });


                        grid.invaders.splice(i, 1);
                        bullets.splice(j, 1);

                         // Adjust grid width and position if invaders remain
                        if (grid.invaders.length > 0){
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length - 1];

                            grid.width = 
                            lastInvader.position.x - 
                            firstInvader.position.x + 
                            lastInvader.width
                            grid.position.x = firstInvader.position.x
                        } else {
                            grids.splice(gridIndex, 1);
                        }
                        }
                    }, 0)
                }
            })
        })
    })

    // Handle player movement 
    if (keys.a.pressed && player.position.x > 0) {
        player.velocity.x = -3;
        player.rotation = -0.15;
    } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
        player.velocity.x = 3;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0; // Stop moving when no arrow keys are pressed
        player.rotation = 0;
    }

    player.x += player.velocity.x; 
    player.update(); 

    //spawn new grids of invaders
    if (frames % randomInterval === 0) {  
        // Added to the grids array using push
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0  // After spawning a new grid, the frames variable is reset 0
    }
    frames++
}

// Event listener for key down
document.addEventListener('keydown', function(event) {
    if ( game.over) return;  // If the game is over, do not process key presses

    // Switch statement to handle different key presses
   switch(event.key) {
    case 'a':
        player.velocity.x = -5; //move left
        console.log('left');
        keys.a.pressed = true;
        break;
    case 'd':
        player.velocity.x = 5; // move right
        console.log('right');
        keys.d.pressed = true;
        break;
    case ' ':
        console.log('space');
        // Create a new bullet and add it to the bullets array
        bullets.push(new Bullet({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10
            }
        }))
        break;
   }

   // spawning new grids of invaders
   if (frames % randomInterval === 0) {
    grids.push(new Grid()); // Create a new grid of invaders
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;  // Reset the frame counter
   }
   frames++;  // Increment the frame counter
});

// Event listener for key up
document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            player.velocity.x = 0;
            keys.d.pressed = false;
            break;
    }
});

let gameOverImage = new Image();
gameOverImage.src = './images/gameover.webp';

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOverImage.complete) {
        gameOverImage.onload = () => {
            ctx.drawImage(gameOverImage, canvas.width / 2 - gameOverImage.width / 2, canvas.height / 2 - gameOverImage.height / 2);
        };
    } else {
        ctx.drawImage(gameOverImage, canvas.width / 2 - gameOverImage.width / 2, canvas.height / 2 - gameOverImage.height / 2);
    }

    setTimeout(() => {
        const restartGame = window.confirm("Game Over! Do you want to restart the game?");
        if (restartGame) {
            window.location.reload();
        }
    }, 100);
}

let gameStarted = false;
// Function to start the game
function startGame() {
    if(gameStarted){
        return;
    }
    gameStarted = true;

    // Initialize game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetGameState();
    const player = new Player();
    const bullets = [];
    const grids = new Grid();
    animate();  // Start the animation loop

    // Hide the start button
    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
}

function resetGameState(){
    score = 0;
    scoreEl.innerHTML = score;  // Update the score display
}
// Add event listeners for starting the game when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);
});