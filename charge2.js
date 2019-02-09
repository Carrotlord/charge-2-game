var g = {
    context: null,
    player: new Player(),
    entities: [],
    intersections: []
};

var SCREEN_HEIGHT = 500;
var SCREEN_WIDTH = 800;
var GAME_BG_COLOR = "#a0a0a0";

var KEY_DOWN = 40;
var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var COULOMBS_CONSTANT = 1;

function keyDownAction(event) {
    // Prevent the arrow keys from scrolling the page:
    event.preventDefault();
    // React to keyboard input:
    switch (event.keyCode) {
        case KEY_DOWN:
            g.player.walkDown();
            break;
        case KEY_UP:
            g.player.walkUp();
            break;
        case KEY_LEFT:
            g.player.walkLeft();
            break;
        case KEY_RIGHT:
            g.player.walkRight();
            break;
    }
}

function drawCircle(x, y, radius) {
    g.context.beginPath();
    g.context.strokeStyle = "black";
    g.context.lineWidth = 3;
    g.context.arc(x, y, radius, 0, 2 * Math.PI);
    g.context.stroke();
    g.context.fillStyle = "white";
    g.context.fill();
}

function drawGenericRect(x, y, width, height, strokeColor, strokeWidth, fillColor) {
    g.context.strokeStyle = strokeColor;
    g.context.lineWidth = strokeWidth;
    // Need to begin path to avoid player border
    // connecting with rectangle border
    g.context.beginPath();
    g.context.rect(x, y, width, height);
    g.context.stroke();
    if (!isUndefined(fillColor)) {
        g.context.fillStyle = fillColor;
        g.context.fill();
    }
}

function drawRect(x, y, width, height) {
    drawGenericRect(x, y, width, height, "black", 3, "white");
}

function clearScreen() {
    g.context.fillStyle = GAME_BG_COLOR;
    g.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function isUnaffectedByCharge(entity) {
    return isUndefined(entity.charge) ||
           isUndefined(entity.mass) ||
           entity.charge === 0;
}

function coulombsLawAcceleration(entity, other) {
    if (isUnaffectedByCharge(entity) || isUnaffectedByCharge(other)) {
        return 0;
    }
    var force = (COULOMBS_CONSTANT * entity.charge * other.charge) /
                squaredDistanceBetween(entity, other);
    var accelMagnitude = force / entity.mass;
    var accelVector = convertPointsToVector(
        other.getCenter().x, other.getCenter().y,
        entity.getCenter().x, entity.getCenter().y
    );
    accelVector.setMagnitude(accelMagnitude);
    return accelVector;
}

function squaredDistanceBetween(entity, other) {
    var deltaX = entity.getCenter().x - other.getCenter().x;
    var deltaY = entity.getCenter().y - other.getCenter().y;
    return deltaX * deltaX + deltaY * deltaY;
}

function pairwiseAction(action) {
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        for (var j = 0; j < g.entities.length; j++) {
            var otherEntity = g.entities[j];
            // Perform action with all entities except self
            if (currentEntity !== otherEntity) {
                action(currentEntity, otherEntity);
            }
        }
    }
}

function collisionDetect() {
    g.intersections = [];
    for (var i = 0; i < g.entities.length; i++) {
        g.entities[i].hitbox.resetCollidingSides();
    }
    pairwiseAction(function(currentEntity, otherEntity) {
        // Draw the intersection
        var intersection = currentEntity.hitbox.intersect(otherEntity.hitbox);
        currentEntity.hitbox.updateColliding(otherEntity.hitbox, intersection);
        if (intersection !== null) {
            g.intersections.push(intersection);
        }
    });
}

function applyCoulombsLaw() {
    pairwiseAction(function(currentEntity, otherEntity) {
        if (!isUnaffectedByCharge(currentEntity) &&
            !isUnaffectedByCharge(otherEntity)) {
            var accelVector = coulombsLawAcceleration(currentEntity, otherEntity);
            currentEntity.xAccelerate(accelVector.xComponent);
            currentEntity.yAccelerate(accelVector.yComponent);
        }
    });
}

function draw() {
    window.requestAnimationFrame(draw);
    clearScreen();
    drawRect(20, 20, 40, 50);
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        currentEntity.draw();
        if (!isUndefined(currentEntity.move)) {
            currentEntity.move();
        }
    }
    applyCoulombsLaw();
    collisionDetect();
    // All hitboxes should be drawn after entities are finished drawing
    for (var i = 0; i < g.entities.length; i++) {
        g.entities[i].hitbox.draw();
    }
    for (var i = 0; i < g.intersections.length; i++) {
        g.intersections[i].draw();
    }
    drawRect(100, 20, 40, 50);
}

function testEntities(whichTest) {
    switch (whichTest) {
        case "2-positives":
            g.entities.push(new Weight(1, 1, 200, 200));
            g.entities.push(new Weight(1, 1, 250, 200));
            break;
        case "2-strong-positives":
            g.entities.push(new Weight(1, 10, 200, 200));
            g.entities.push(new Weight(1, 10, 250, 200));
            break;
        case "2-negatives":
            g.entities.push(new Weight(1, -1, 200, 200));
            g.entities.push(new Weight(1, -1, 250, 200));
            break;
        case "2-strong-negatives":
            g.entities.push(new Weight(1, -10, 200, 200));
            g.entities.push(new Weight(1, -10, 250, 200));
            break;
        case "2-opposites":
            g.entities.push(new Weight(1, 1, 200, 200));
            g.entities.push(new Weight(1, -1, 250, 200));
            break;
        case "2-strong-opposites":
            g.entities.push(new Weight(1, 10, 200, 200));
            g.entities.push(new Weight(1, -10, 250, 200));
            break;
        case "4-positives":
            g.entities.push(new Weight(1, 1, 200, 200));
            g.entities.push(new Weight(1, 1, 250, 200));
            g.entities.push(new Weight(1, 1, 200, 260));
            g.entities.push(new Weight(1, 1, 250, 260));
            break;
        case "4-negatives":
            g.entities.push(new Weight(1, -1, 200, 200));
            g.entities.push(new Weight(1, -1, 250, 200));
            g.entities.push(new Weight(1, -1, 200, 260));
            g.entities.push(new Weight(1, -1, 250, 260));
            break;
        case "4-mixed":
            g.entities.push(new Weight(1, 1, 200, 200));
            g.entities.push(new Weight(1, -1, 250, 200));
            g.entities.push(new Weight(1, -1, 200, 260));
            g.entities.push(new Weight(1, 1, 250, 260));
            break;
        case "4-mixed-b":
            g.entities.push(new Weight(1, 1, 200, 200));
            g.entities.push(new Weight(1, 1, 250, 200));
            g.entities.push(new Weight(1, -1, 200, 260));
            g.entities.push(new Weight(1, 1, 250, 260));
            break;
    }
}

function setup() {
    g.entities.push(g.player);
    g.entities.push(new Wall(180, 20, 10, 80));
    g.entities.push(new Wall(260, 20, 30, 60));
    g.entities.push(new Wall(340, 20, 25, 70));
    g.entities.push(new Wall(420, 20, 25, 100));
    g.entities.push(new Wall(380, 70, 100, 20));
    var canvas = document.getElementById("screen");
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    g.context = canvas.getContext("2d");
    window.addEventListener("keydown", keyDownAction);
    draw();
}
