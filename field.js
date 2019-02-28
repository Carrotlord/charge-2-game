function Field(x, y, width, height, rotationAngle, strength) {
    this.isFixed = true;
    this.isSolid = false;
    this.type = ":field";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotationAngle = rotationAngle;
    this.strength = strength || 0.12;
    this.hitbox = new Hitbox(this, 0, 0, this.width, this.height);
}

Field.prototype.draw = function() {
    var xOffset = 10;
    var yOffset = 5;
    var xSpacing = 15;
    var ySpacing = 25;
    var maxX = this.x + this.width;
    var maxY = this.y + this.height - 16;
    for (var currentX = this.x + xOffset; currentX < maxX; currentX += xSpacing) {
        for (var currentY = this.y + yOffset; currentY < maxY; currentY += ySpacing) {
            drawArrow(currentX, currentY, this.rotationAngle);
        }
    }
}
