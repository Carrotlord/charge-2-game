function Player() {
    this.x = 200;
    this.y = 200;
    this.walkXVel = 5;
    this.walkYVel = 5;
    this.hitbox = new Hitbox(this, -10, -15, 10, 15);
}

Player.prototype.walkDown = function() {
    this.y += this.walkYVel;
}

Player.prototype.walkUp = function() {
    this.y -= this.walkYVel;
}

Player.prototype.walkLeft = function() {
    this.x -= this.walkXVel;
}

Player.prototype.walkRight = function() {
    this.x += this.walkXVel;
}

Player.prototype.draw = function() {
    drawCircle(this.x, this.y, 10);
}
