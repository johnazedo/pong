const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io("ws://172.21.250.177:3000");
const scoreText = document.querySelector("#scoreText");
const warnings = document.querySelector("#warnings");

function updateScore() {
    scoreText.textContent = `${leftPlayerScore} : ${rightPlayerScore}`;
}

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const BALL_RADIUS = 12.5;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

let playerID = "";
let gameID = "";
let leftPaddleY = 0;
let rightPaddleY = 0;
let ballX = 400;
let ballY = 400;
let leftPlayerScore = 0;
let rightPlayerScore = 0;

socket.on('startGame', (data) => {
    playerID = data.playerID;
    gameID = data.gameID;
    warnings.textContent = ""
    draw()
});

socket.on('updatePaddle', (data) => {
    rightPaddleY = data.y;
    draw();
});

socket.on('playerDisconnected', () => {
    warnings.textContent = "O outro jogador ficou offline"
});

socket.on('waitingSecondPlayer', () => {
    warnings.textContent = "Esperando segundo jogador"
})

socket.on('getStatus', (data) => {
    leftPlayerScore = data.playerOneScore
    rightPlayerScore = data.playerTwoScore
    ballX = data.ballX
    ballY = data.ballY
    updateScore();
    draw();
});

canvas.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    leftPaddleY = mouseY;
    draw();
    socket.emit('updatePaddle', { game: gameID, player: playerID, y: mouseY });
});

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball 
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();


    // requestAnimationFrame(draw);
}
