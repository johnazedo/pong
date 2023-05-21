let side = null;

function chooseSide() {
    const input = prompt('Choose your side (left or right):');
    if (input === 'left' || input === 'right') {
        side = input;
    } else {
        alert('Invalid choice. Please choose "left" or "right".');
        chooseSide();
    }
}

chooseSide();


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io("http://172.25.221.44:8000/socket.io/", { transports: ['websocket'] });
const scoreText = document.querySelector("#scoreText");

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 12.5;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let leftPlayerScore = 0;
let rightPlayerScore = 0;

function updateScore() {
    scoreText.textContent = `${leftPlayerScore} : ${rightPlayerScore}`;
}

class Ball {
    constructor(x, y, dirX, dirY, speed) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = speed;
    }

    getY() {
        return this.y;
    }

    getX() {
        return this.x;
    }

    moveBall() {
        this.x += (this.speed * this.dirX);
        this.y += (this.speed * this.dirY);
    };

    changeSpeed() {}
    changeDirection(x, y) {}
}

class Paddle {
    constructor(y) {
        this.y = y ;
        this.height = PADDLE_HEIGHT;
        this.width = PADDLE_WIDTH;
    }

    updateY(y) {
        this.y = y - (this.height / 2);
    }

    getY() {
        return this.y;
    }
}

let ball = new Ball(canvas.width/2, canvas.height/2, 1, 0, 1)
let leftPaddle = new Paddle((canvas.height - PADDLE_HEIGHT) / 2)
let rightPaddle = new Paddle((canvas.height - PADDLE_HEIGHT) / 2)


function checkCollision() {

    if(ball.getX() <= 0) {
        ball = new Ball(canvas.width/2, canvas.height/2, -1, 0, 1)
        rightPlayerScore+=1;
        updateScore();
    }

    if(ball.getX() >= GAME_WIDTH) {
        ball = new Ball(canvas.width/2, canvas.height/2, -1, 0, 1)
        leftPlayerScore+=1;
        updateScore();
    }
}

socket.on('updatePaddle', (data) => {
    if (data.player === 'left') {
        leftPaddle.updateY(data.y)
    } else {
        rightPaddle.updateY(data.y)
    }
});

canvas.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    if (side === 'left') {
        leftPaddle.updateY(mouseY)
    } else {
        rightPaddle.updateY(mouseY)
    }
    socket.emit('updatePaddle', { player: side, y: mouseY });
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddle.getY(), PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightPaddle.getY(), PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball 
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ball.moveBall()
    checkCollision()

    requestAnimationFrame(draw);
}

draw();
