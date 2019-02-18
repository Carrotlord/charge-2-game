function Weight(mass, charge, x, y) {
    this.isFixed = false;
    this.mass = mass;
    this.charge = charge;
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.height = 20;
    this.width = 20;
    this.hitbox = new Hitbox(this, 0, 0, this.width, this.height);
}

Weight.prototype.getCenter = function() {
    return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
    };
}

Weight.prototype.move = function() {
    this.moveX();
    this.moveY();
}

Weight.prototype.moveX = function() {
    if ((this.xVel < 0 && !this.hitbox.isLeftColliding) ||
        (this.xVel > 0 && !this.hitbox.isRightColliding)) {
        this.x += this.xVel;
    } else {
        this.xVel = 0;
    }
}

Weight.prototype.moveY = function() {
    if ((this.yVel < 0 && !this.hitbox.isTopColliding) ||
        (this.yVel > 0 && !this.hitbox.isBottomColliding)) {
        this.y += this.yVel;
    } else {
        this.yVel = 0;
    }
}

Weight.prototype.draw = function() {
    drawRect(this.x, this.y, this.width, this.height);
    var center = this.getCenter();
    if (this.charge > 0) {
        drawPlus(center.x, center.y, 7);
    } else if (this.charge < 0) {
        drawMinus(center.x, center.y, 7);
    }
}

Weight.prototype.xAccelerate = function(accelAmount) {
    this.xVel += accelAmount;
}

Weight.prototype.yAccelerate = function(accelAmount) {
    this.yVel += accelAmount;
}
