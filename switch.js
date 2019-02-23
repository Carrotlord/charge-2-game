/**
 * Switches are devices that can be turned on when colliding with
 * a weight. They can perform arbitrary actions when activated or
 * deactivated, such as opening doors or changing the direction of
 * an electric field.
 * `targets` refers to objects such as walls that the switch manipulates.
 * `targets` should be an object with properties that point to the entities
 * being manipulated, such as:
 * var targets = {
 *     door1: ...,
 *     door2: ...,
 *     field1: ...
 * };
 * These entities should also be added to g.entities.
 * `onAction` and `offAction` are functions that take a single argument
 * targets. They perform the tasks that the switch is designed to handle.
 */
function Switch(x, y, width, height, targets, onAction, offAction) {
    this.isFixed = true;
    this.isSolid = false;
    this.type = ":switch";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.targets = targets;
    this.onAction = onAction;
    if (isUndefined(offAction)) {
        // Default off-action does nothing
        this.offAction = function(targets) {};
    } else {
        this.offAction = offAction;
    }
    // Switches are off when created
    this.isOn = false;
    this.hitbox = new Hitbox(this, 0, 0, this.width, this.height);
}

Switch.prototype.draw = function() {
    var currentColor = this.isOn ? "green" : "red";
    drawGenericRect(this.x, this.y, this.width, this.height, "black", 3, currentColor);
}

Switch.prototype.turnOn = function() {
    if (!this.isOn) {
        this.isOn = true;
        this.onAction(this.targets);
    }
}

Switch.prototype.turnOff = function() {
    if (this.isOn) {
        this.isOn = false;
        this.offAction(this.targets);
    }
}
