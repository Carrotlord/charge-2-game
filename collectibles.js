function Goal(x, y) {
    this.isFixed = true;
    this.isSolid = false;
    this.x = x;
    this.y = y;
    this.hitbox = new Hitbox(this, -4, -4, 9, 9);
}

Goal.prototype.collect = function() {
    // Go to the next level
    loadLevel(g.currentLevel + 1);
}

Goal.prototype.draw = function() {
    drawStar(this.x, this.y, 7);
}
