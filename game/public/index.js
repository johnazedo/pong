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
const socket = io("ws://172.21.250.180:3000");
const scoreText = document.querySelector("#scoreText");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

let leftPlayerScore = 0;
let rightPlayerScore = 0;

function updateScore() {
    scoreText.textContent = `${leftPlayerScore} : ${rightPlayerScore}`;
}

let ball = new Ball(GAME_WIDTH/2, GAME_HEIGHT/2, -1, 1, 1)
let leftPaddle = new Paddle((GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)
let rightPaddle = new Paddle((GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)


function checkCollision() {

    // Left player score
    if(ball.getX() <= 0) {
        ball = new Ball(GAME_WIDTH/2, GAME_HEIGHT/2, -1, 1, 1)
        rightPlayerScore+=1;
        updateScore();
    }

    // Right player score
    if(ball.getX() >= GAME_WIDTH) {
        ball = new Ball(GAME_WIDTH/2, GAME_HEIGHT/2, -1, -1, 1)
        leftPlayerScore+=1;
        updateScore();
    }

    // When ball hit on top
    if (ball.getY() <= Ball.BALL_RADIUS) {
        ball.changeDirection(ball.dirX, ball.dirY * -1);
    }

    // When ball hit on bottom
    if (ball.getY() >= GAME_HEIGHT - Ball.BALL_RADIUS) {
        ball.changeDirection(ball.dirX, ball.dirY * -1);
    }

    // When ball hit on left paddle
    if(ball.getX() <= Paddle.PADDLE_WIDTH + Ball.BALL_RADIUS) {
        if (ball.getY() > leftPaddle.getY() && ball.getY() < leftPaddle.getY() + Paddle.PADDLE_HEIGHT) {
            ball.changeDirection(ball.getDirX() * -1, ball.getDirY());
            ball.increaseSpeed();
        }
    }

    // When ball hit on right paddle
    if(ball.getX() >= (GAME_WIDTH - Paddle.PADDLE_WIDTH) - Ball.BALL_RADIUS) {
        if (ball.getY() > rightPaddle.getY() && ball.getY() < rightPaddle.getY() + Paddle.PADDLE_HEIGHT) {
            ball.changeDirection(ball.getDirX() * -1, ball.getDirY());
            ball.increaseSpeed();
        }
    }

}

socket.on('startGame', () => {});

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
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddle.getY(), Paddle.PADDLE_WIDTH, Paddle.PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - Paddle.PADDLE_WIDTH, rightPaddle.getY(), Paddle.PADDLE_WIDTH, Paddle.PADDLE_HEIGHT);

    // Draw ball 
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), Ball.BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ball.moveBall()
    checkCollision()

    requestAnimationFrame(draw);
}

draw();
