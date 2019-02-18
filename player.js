function Player(x, y) {
    this.isFixed = false;
    this.x = x;
    this.y = y;
    this.walkXVel = 5;
    this.walkYVel = 5;
    this.xVel = 0;
    this.yVel = 0;
    this.mass = 1;
    this.hitbox = new Hitbox(this, -10, -15, 10, 15);
}

Player.prototype.isInAir = function() {
    return !this.hitbox.isBottomColliding || this.yVel < 0;
}

Player.prototype.move = function() {
    if (this.yVel > 0) {
        if (this.hitbox.isBottomColliding) {
            this.yVel = 0;
        } else {
            this.y += this.yVel;
        }
    } else if (this.yVel < 0) {
        if (this.hitbox.isTopColliding) {
            this.yVel = 0;
        } else {
            this.y += this.yVel;
        }
    }
}

Player.prototype.yAccelerate = function(accelAmount) {
    this.yVel += accelAmount;
}

Player.prototype.walkDown = function() {
    if (!this.hitbox.isBottomColliding) {
        this.y += this.walkYVel;
    }
}

Player.prototype.walkUp = function() {
    if (!this.hitbox.isTopColliding) {
        this.y -= this.walkYVel;
    }
}

Player.prototype.walkLeft = function() {
    if (!this.hitbox.isLeftColliding) {
        this.x -= this.walkXVel;
    }
}

Player.prototype.walkRight = function() {
    if (!this.hitbox.isRightColliding) {
        this.x += this.walkXVel;
    }
}

Player.prototype.jump = function() {
    if (!this.isInAir()) {
        this.yVel = 0;
        this.yAccelerate(-15);
    }
}

Player.prototype.draw = function() {
    drawCircle(this.x, this.y, 10);
}
