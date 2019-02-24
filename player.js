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
    this.hitbox = new Hitbox(this, -10, -15, 10, 15);
    this.positiveWeights = 5;
    this.negativeWeights = 5;
    this.neutralWeights = 5;
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
