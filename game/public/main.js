const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io("ws://172.21.250.180:3000");
const scoreText = document.querySelector("#scoreText");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const BALL_RADIUS = 12.5;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

let playerID = "";
let gameID = "";
let leftPaddleY = 0;
let rightPaddleY = 0;

socket.on('startGame', (data) => {
    playerID = data.playerID;
    gameID = data.gameID;
    draw();
});

socket.on('updatePaddle', (data) => {
    rightPaddleY = data.rightPaddleY;
});

socket.on('getStatus', (data) => {
});

canvas.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    socket.emit('updatePaddle', { game: gameID, player: playerID, y: mouseY });
});

function askStatus() {
    socket.emit('askStatus', {game: gameID, player: playerID})
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, rightPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball 
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    askStatus();

    requestAnimationFrame(draw);
}
