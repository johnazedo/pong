class Ball {
  static get BALL_RADIUS() { return 12.5 };

  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.dirX = 1;
      this.dirY = 1;
      this.speed = 1;
  }

  getY() {
      return this.y;
  }

  getX() {
      return this.x;
  }

  getDirX() {
      return this.dirX;
  }

  getDirY() {
      return this.dirY;
  }

  moveBall() {
      this.x += (this.speed * this.dirX);
      this.y += (this.speed * this.dirY);
  };

  increaseSpeed() {
      this.speed += 1;
  }

  changeDirection(x, y) {
      this.dirX = x;
      this.dirY = y;
  }

  getInvertX() {
      return 800 - this.x;
  }
}

class Paddle {
  static get PADDLE_HEIGHT() { return 100 };
  static get PADDLE_WIDTH() { return 10 };

  constructor(y) {
      this.y = y ;
  }

  updateY(y) {
      this.y = y - (Paddle.PADDLE_HEIGHT / 2);
  }

  getY() {
      return this.y;
  }
}

class Game {
    static get GAME_WIDTH() { return 800 };
    static get GAME_HEIGHT() { return 600 };

    constructor(id, playerOneId, playerTwoId) {
        this.id = id;
        this.status = false;
        this.playerOne = playerOneId;
        this.playerTwo = playerTwoId;
        this.playerOneScore = 0
        this.playerTwoScore = 0
        this.ball = new Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
        this.leftPaddle = new Paddle((Game.GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)
        this.rightPaddle = new Paddle((Game.GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)
    }

    checkCollision() {
        // Left player score
        if(this.ball.getX() <= 0) {
            this.ball = new Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
            this.playerTwoScore+=1;
        }
    
        // Right player score
        if(this.ball.getX() >= Game.GAME_WIDTH) {
            this.ball = new Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
            this.playerOneScore+=1;
        }
    
        // When ball hit on top
        if (this.ball.getY() <= Ball.BALL_RADIUS) {
            this.ball.changeDirection(this.ball.dirX, this.ball.dirY * -1);
        }
    
        // When ball hit on bottom
        if (this.ball.getY() >= Game.GAME_HEIGHT - Ball.BALL_RADIUS) {
            this.ball.changeDirection(this.ball.dirX, this.ball.dirY * -1);
        }
    
        // When ball hit on left paddle
        if(this.ball.getX() <= Paddle.PADDLE_WIDTH + Ball.BALL_RADIUS) {
            if (this.ball.getY() > this.leftPaddle.getY() && this.ball.getY() < this.leftPaddle.getY() + Paddle.PADDLE_HEIGHT) {
                this.ball.changeDirection(this.ball.getDirX() * -1, this.ball.getDirY());
                this.ball.increaseSpeed();
            }
        }
    
        // When ball hit on right paddle
        if(this.ball.getX() >= (Game.GAME_WIDTH - Paddle.PADDLE_WIDTH) - Ball.BALL_RADIUS) {
            if (this.ball.getY() > this.rightPaddle.getY() && this.ball.getY() < this.rightPaddle.getY() + Paddle.PADDLE_HEIGHT) {
                this.ball.changeDirection(this.ball.getDirX() * -1, this.ball.getDirY());
                this.ball.increaseSpeed();
            }
        }
    }

    getStatus() {
        return {
            ballX: this.ball.getX(),
            ballY: this.ball.getY(),
            playerOneScore: this.playerOneScore,
            playerTwoScore: this.playerTwoScore,
        }
    }

    getStatusInverted() {
        return {
            ballX: this.ball.getInvertX(),
            ballY: this.ball.getY(),
            playerOneScore: this.playerTwoScore,
            playerTwoScore: this.playerOneScore,
        }
    }
}

const express = require('express');
const app = express();
const http = require('http').Server(app);
var cors = require('cors')
const io = require('socket.io')(http);
const crypto = require('crypto');
const uuid = require('uuid');

app.use(express.static('public'));
app.use(cors)

const games = new Map();
const players = new Map();
const room = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  let userId = uuid.v4().toString()
  players.set(userId, socket)
  room.push(userId)

  if(room.length < 2) {
    socket.emit("waitingSecondPlayer")
  }

  if(room.length == 2) {
    let gameId = uuid.v4().toString()
    const gameObj = new Game(gameId, room.shift(), room.shift())
    games.set(gameId, gameObj)
    let socketOne = players.get(gameObj.playerOne)
    let socketTwo = players.get(gameObj.playerTwo)

    console.log("The game started")
    io.to(socketOne.id).emit("startGame", {
      playerID: gameObj.playerOne,
      gameID: gameObj.id
    })
    io.to(socketTwo.id).emit("startGame", {
      playerID: gameObj.playerTwo,
      gameID: gameObj.id
    })

    gameObj.status = true;

    let timer = setInterval(() => {
      gameObj.ball.moveBall()
      gameObj.checkCollision()
      io.to(socketOne.id).emit("getStatus", gameObj.getStatus())
      io.to(socketTwo.id).emit("getStatus", gameObj.getStatusInverted())
      
       if(!socketTwo.connected) {
        socketOne.emit("playerDisconnected")
        clearInterval(timer);
      }

      if(!socketOne.connected) {
        socketTwo.emit("playerDisconnected")
        clearInterval(timer);
      }
    }, 10)
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('updatePaddle', (data) => {
    let game = games.get(data.game);
    if(game !== undefined && game !== null) {
      let socketOne = players.get(game.playerOne);
      let socketTwo = players.get(game.playerTwo);
      
      if(data.player == game.playerOne){
        game.leftPaddle.y = data.y;
        io.to(socketTwo.id).emit("updatePaddle", {y: data.y})
      }

      if(data.player == game.playerTwo){
        game.rightPaddle.y = data.y;
        io.to(socketOne.id).emit("updatePaddle",{y: data.y})
      }
    }
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

