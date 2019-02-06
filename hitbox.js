function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.draw = function() {
    drawGenericRect(this.x, this.y, this.width, this.height, "blue", 1);
}

function Hitbox(owner, xOffset, yOffset, xOffset2, yOffset2) {
    this.owner = owner;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.xOffset2 = xOffset2;
    this.yOffset2 = yOffset2;
    console.assert(this.xOffset < this.xOffset2, "xOffset2 can't be less than xOffset");
    console.assert(this.yOffset < this.yOffset2, "yOffset2 can't be less than yOffset");
    this.resetCollidingSides();
}

Hitbox.prototype.resetCollidingSides = function() {
    this.isLeftColliding = false;
    this.isRightColliding = false;
    this.isTopColliding = false;
    this.isBottomColliding = false;
}

Hitbox.prototype.getX = function() {
    return this.owner.x + this.xOffset;
}

Hitbox.prototype.getY = function() {
    return this.owner.y + this.yOffset;
}

Hitbox.prototype.getX2 = function() {
    return this.owner.x + this.xOffset2;
}

Hitbox.prototype.getY2 = function() {
    return this.owner.y + this.yOffset2;
}

Hitbox.prototype.getWidth = function() {
    return this.getX2() - this.getX();
}

Hitbox.prototype.getHeight = function() {
    return this.getY2() - this.getY();
}

Hitbox.prototype.getCenter = function() {
    return {
        x: this.getX() + this.getWidth() / 2,
        y: this.getY() + this.getHeight() / 2
    };
}

Hitbox.prototype.draw = function() {
    drawGenericRect(this.getX(), this.getY(), this.getWidth(), this.getHeight(), "red", 1);
}

Hitbox.prototype.intersect = function(otherHitbox) {
    var x = Math.max(this.getX(), otherHitbox.getX());
    var y = Math.max(this.getY(), otherHitbox.getY());
    var x2 = Math.min(this.getX2(), otherHitbox.getX2());
    var y2 = Math.min(this.getY2(), otherHitbox.getY2());
    if (x > x2 || y > y2) {
        return null;
    } else {
        return new Rectangle(x, y, x2 - x, y2 - y);
    }
}

Hitbox.prototype.updateColliding = function(otherHitbox, intersection) {
    if (intersection !== null) {
        if (intersection.height > intersection.width) {
            if (this.getCenter().x < otherHitbox.getCenter().x) {
                this.isRightColliding = true;
            } else {
                this.isLeftColliding = true;
            }
        } else {
            if (this.getCenter().y < otherHitbox.getCenter().y) {
                this.isBottomColliding = true;
            } else {
                this.isTopColliding = true;
            }
        }
    }
}
