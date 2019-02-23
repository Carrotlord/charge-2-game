function Wall(x, y, width, height) {
    this.isFixed = true;
    this.isSolid = true;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hitbox = new Hitbox(this, 0, 0, this.width, this.height);
}

Wall.prototype.draw = function() {
    drawRect(this.x, this.y, this.width, this.height);
}
