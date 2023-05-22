
class Ball {
    static BALL_RADIUS = 12.5;

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
        return this.x * -1;
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