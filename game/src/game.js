import { Ball, Paddle } from './models'

class Game {
    static GAME_WIDTH = 800;
    static GAME_HEIGHT = 600;

    playerOneScore = 0
    playerTwoScore = 0
    ball = Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
    leftPaddle = new Paddle((GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)
    rightPaddle = new Paddle((GAME_HEIGHT - Paddle.PADDLE_HEIGHT) / 2)

    constructor(id, playerOneId, playerTwoId) {
        this.id = id;
        this.playerOne = playerOneId;
        this.playerTwo = playerTwoId;
    }

    checkCollision() {
        // Left player score
        if(ball.getX() <= 0) {
            ball = new Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
            this.playerOneScore+=1;
        }
    
        // Right player score
        if(ball.getX() >= GAME_WIDTH) {
            ball = new Ball(Game.GAME_WIDTH/2, Game.GAME_HEIGHT/2)
            this.playerTwoScore+=1;
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

    getStatus() {
        return {
            ballX: this.ball.getX(),
            ballY: this.ball.getY(),
            playerOneSocre: this.playerOneScore,
            playerTwoScore: this.playerTwoScore,
            
        }
    }
}