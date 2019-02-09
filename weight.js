function Weight(mass, charge, x, y) {
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
    this.x += this.xVel;
    this.y += this.yVel;
}

Weight.prototype.draw = function() {
    drawRect(this.x, this.y, this.width, this.height);
}

Weight.prototype.xAccelerate = function(accelAmount) {
    this.xVel += accelAmount;
}
