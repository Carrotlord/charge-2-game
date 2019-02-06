function Player() {
    this.x = 200;
    this.y = 200;
    this.walkXVel = 5;
    this.walkYVel = 5;
    this.hitbox = new Hitbox(this, -10, -15, 10, 15);
}

Player.prototype.walkDown = function() {
    if (!this.hitbox.isBottomColliding) {
        this.y += this.walkYVel;
        this.moveMade();
    }
}

Player.prototype.walkUp = function() {
    if (!this.hitbox.isTopColliding) {
        this.y -= this.walkYVel;
        this.moveMade();
    }
}

Player.prototype.walkLeft = function() {
    if (!this.hitbox.isLeftColliding) {
        this.x -= this.walkXVel;
        this.moveMade();
    }
}

Player.prototype.walkRight = function() {
    if (!this.hitbox.isRightColliding) {
        this.x += this.walkXVel;
        this.moveMade();
    }
}

Player.prototype.draw = function() {
    drawCircle(this.x, this.y, 10);
}

Player.prototype.moveMade = function() {
    collisionDetect();
}
