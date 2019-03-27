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
    drawTiling(
        this.x,
        this.y,
        10, 5, 15, 25,
        this.x + this.width,
        this.y + this.height - 16,
        (function(x, y) {
            drawArrow(x, y, this.rotationAngle);
        }).bind(this)
    );
}

function MagneticField(x, y, width, height, direction, strength) {
    this.isFixed = true;
    this.isSolid = false;
    this.type = ":magnetic_field";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.strength = strength || 0.04;
    // Assertion must be done after assigning to this.strength,
    // because (undefined >= 0) is false.
    console.assert(this.strength >= 0, "Magnetic field strength must be positive");
    if (direction === ":into_screen") {
        this.strength = -this.strength;
    }
    this.hitbox = new Hitbox(this, 0, 0, this.width, this.height);
}

MagneticField.prototype.draw = function() {
    // If the field points into the screen, draw a cross circle.
    // Otherwise, draw a dot circle.
    var drawTile = this.strength < 0 ? drawCrossCircle : drawDotCircle;
    drawTiling(
        this.x,
        this.y,
        10, 12, 21, 25,
        this.x + this.width,
        this.y + this.height - 10,
        drawTile
    );
}
