
class Ball {
    static BALL_RADIUS = 12.5;

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
}

class Paddle {
    static PADDLE_HEIGHT = 100;
    static PADDLE_WIDTH = 10;

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