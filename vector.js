function Vector(xComponent, yComponent) {
    this.xComponent = xComponent;
    this.yComponent = yComponent;
}

Vector.prototype.getAngle = function() {
    return Math.atan2(this.yComponent, this.xComponent);
}

Vector.prototype.setMagnitude = function(newMagnitude) {
    var theta = this.getAngle();
    this.xComponent = newMagnitude * Math.cos(theta);
    this.yComponent = newMagnitude * Math.sin(theta);
}

function convertPointsToVector(x, y, x2, y2) {
    return new Vector(x2 - x, y2 - y);
}

function convertMagnitudeAngleToVector(magnitude, angle) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}
