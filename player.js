function Player() {
    this.x = 100;
    this.y = 170;
    this.walkXVel = 5;
    this.walkYVel = 5;
    this.hitbox = new Hitbox(this, -10, -15, 10, 15);
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

Player.prototype.draw = function() {
    drawCircle(this.x, this.y, 10);
}
