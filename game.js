// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const usernameInput = document.getElementById('usernameInput');
const startButton = document.getElementById('startButton');
const usernameContainer = document.getElementById('usernameContainer');
const scoreContainer = document.getElementById('scoreContainer');
const scoreValue = document.getElementById('scoreValue');

// Game parameters
let gameRunning = false;
let score = 0;
let gravity = 0.5;
let birdVelocity = 0;
let birdPosition = canvas.height / 2;
let birdWidth = 40;
let birdHeight = 30;
let pipeWidth = 60;
let pipeGap = 150;
let pipes = [];
let frameCount = 0;
let username = '';

// Game assets
const birdImg = new Image();
birdImg.src = 'https://raw.githubusercontent.com/8434ashish/Flappy-Phoenix/main/assets/bird.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'https://raw.githubusercontent.com/8434ashish/Flappy-Phoenix/main/assets/pipeTop.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'https://raw.githubusercontent.com/8434ashish/Flappy-Phoenix/main/assets/pipeBottom.png';

const backgroundImg = new Image();
backgroundImg.src = 'https://raw.githubusercontent.com/8434ashish/Flappy-Phoenix/main/assets/background.png';

// Event listeners
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);

// Handle keyboard input
function handleKeyPress(e) {
    if (e.code === 'Space') {
        if (!gameRunning) {
            startGame();
        } else {
            birdVelocity = -10;
        }
    }
}

// Start game function
function startGame() {
    if (usernameInput.value.trim() === '') {
        alert('Please enter your name to start!');
        return;
    }
    
    username = usernameInput.value.trim();
    usernameContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
    score = 0;
    birdPosition = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    frameCount = 0;
    gameRunning = true;
    
    // Start game loop
    gameLoop();
}

// Create new pipes
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({
        x: canvas.width,
        height: pipeHeight,
        passed: false
    });
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    // Update bird
    birdVelocity += gravity;
    birdPosition += birdVelocity;
    
    // Draw bird
    ctx.save();
    ctx.translate(50, birdPosition);
    ctx.rotate(birdVelocity * 0.02);
    ctx.drawImage(birdImg, -birdWidth/2, -birdHeight/2, birdWidth, birdHeight);
    ctx.restore();
    
    // Create new pipes
    if (frameCount % 100 === 0) {
        createPipe();
    }
    
    // Update and draw pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= 2;
        
        // Draw top pipe
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.height);
        
        // Draw bottom pipe
        const bottomPipeY = pipe.height + pipeGap;
        ctx.drawImage(pipeBottomImg, pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);
        
        // Check for collisions
        if (
            (50 + birdWidth/2 > pipe.x && 50 - birdWidth/2 < pipe.x + pipeWidth) &&
            (birdPosition - birdHeight/2 < pipe.height || 
             birdPosition + birdHeight/2 > bottomPipeY)
        ) {
            gameOver();
            return;
        }
        
        // Check if bird passed the pipe
        if (!pipe.passed && 50 > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
            scoreValue.textContent = score;
        }
        
        // Remove pipes that are off screen
        if (pipe.x < -pipeWidth) {
            pipes.splice(i, 1);
            i--;
        }
    }
    
    // Check if bird hit the ground or ceiling
    if (birdPosition > canvas.height - birdHeight/2 || birdPosition < birdHeight/2) {
        gameOver();
        return;
    }
    
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
    gameRunning = false;
    alert(`Game Over, ${username}! Your score: ${score}`);
    usernameContainer.style.display = 'block';
    scoreContainer.style.display = 'none';
}

// Initial draw
function drawInitialScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffeb3b';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Phoenix', canvas.width/2, 150);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Enter your name and click Start', canvas.width/2, 250);
}

// Initialize game
drawInitialScreen();
