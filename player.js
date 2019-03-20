function Player(x, y) {
    this.isFixed = false;
    this.isSolid = true;
    this.x = x;
    this.y = y;
    this.walkXVel = 5;
    this.walkYVel = 5;
    this.xVel = 0;
    this.yVel = 0;
    this.mass = 1;
    this.hitbox = new Hitbox(this, -10, -10, 10, 40);
    this.positiveWeights = 0;
    this.negativeWeights = 0;
    this.neutralWeights = 0;
    this.dropXOffset = 15;
    this.dropYOffset = -10;
}

Player.prototype.isInAir = function() {
    return !this.hitbox.isBottomColliding || this.yVel < 0;
}

Player.prototype.move = function() {
    if (this.yVel > 0) {
        if (this.hitbox.isBottomColliding) {
            this.yVel = 0;
        } else {
            this.y += this.yVel;
        }
    } else if (this.yVel < 0) {
        if (this.hitbox.isTopColliding) {
            this.yVel = 0;
        } else {
            this.y += this.yVel;
        }
    }
}

Player.prototype.yAccelerate = function(accelAmount) {
    this.yVel += accelAmount;
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

Player.prototype.jump = function() {
    if (!this.isInAir()) {
        this.yVel = 0;
        this.yAccelerate(-15);
    }
}

Player.prototype.draw = function() {
    var bodyHeight = 30;
    var legHeight = 10;
    var armLength = 10;
    var neckHeight = 15;
    g.context.strokeStyle = "black";
    g.context.lineWidth = 2;
    // Body
    g.context.beginPath();
    g.context.moveTo(this.x, this.y);
    g.context.lineTo(this.x, this.y + bodyHeight);
    g.context.stroke();
    // Left leg
    g.context.beginPath();
    g.context.moveTo(this.x, this.y + bodyHeight);
    g.context.lineTo(this.x - legHeight, this.y + bodyHeight + legHeight);
    g.context.stroke();
    // Right leg
    g.context.beginPath();
    g.context.moveTo(this.x, this.y + bodyHeight);
    g.context.lineTo(this.x + legHeight, this.y + bodyHeight + legHeight);
    g.context.stroke();
    // Both arms
    g.context.beginPath();
    g.context.moveTo(this.x - armLength, this.y + neckHeight);
    g.context.lineTo(this.x + armLength, this.y + neckHeight);
    g.context.stroke();
    // Head
    drawCircle(this.x, this.y, 10);
}

Player.prototype.getCenter = function() {
    return this.hitbox.getCenter();
}

Player.prototype.dropWeight = function(weightCharge) {
    g.entities.push(new Weight(1, weightCharge, this.x + this.dropXOffset, this.y + this.dropYOffset));
}

Player.prototype.dropPositiveWeight = function() {
    if (this.positiveWeights > 0) {
        this.dropWeight(10);
        this.positiveWeights--;
    }
}

Player.prototype.dropNegativeWeight = function() {
    if (this.negativeWeights > 0) {
        this.dropWeight(-10);
        this.negativeWeights--;
    }
}

Player.prototype.dropNeutralWeight = function() {
    if (this.neutralWeights > 0) {
        this.dropWeight(0);
        this.neutralWeights--;
    }
}

Player.prototype.collectNearbyWeights = function() {
    var toBeRemoved = [];
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        if (currentEntity.type === ":weight" &&
            distanceBetween(this, currentEntity) <= COLLECT_RADIUS) {
            if (currentEntity.charge > 0) {
                this.positiveWeights++;
            } else if (currentEntity.charge < 0) {
                this.negativeWeights++;
            } else {
                this.neutralWeights++;
            }
            toBeRemoved.push(currentEntity);
        }
    }
    // Erase all nearby weights
    toBeRemoved.forEach(function(entity) {
        removeEntity(entity);
    });
}
