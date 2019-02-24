var g = {
    context: null,
    player: null,
    mainMenu: null,
    entities: [],
    intersections: [],
    messageBoxes: [],
    pressedKeys: {}
};

var SCREEN_HEIGHT = 500;
var SCREEN_WIDTH = 800;
var GAME_BG_COLOR = "#a0a0a0";
var DIALOGUE_FONT = "Tahoma";

var KEY_DOWN = "40";
var KEY_UP = "38";
var KEY_LEFT = "37";
var KEY_RIGHT = "39";
var KEY_ENTER = "13";
var KEY_Z = "90";
var KEY_X = "88";
var KEY_C = "67";

var COLLISION_THRESHOLD = 1;

var COULOMBS_CONSTANT = 1;
var GRAVITATIONAL_ACCEL = 1;
var COLLECT_RADIUS = 60;

var DEBUG_MODE = true;

function preventDefault(event) {
    // Prevent the arrow keys from scrolling the page:
    if (!DEBUG_MODE) {
        event.preventDefault();
    }
}

function registerKeyDown(event) {
    preventDefault(event);
    g.pressedKeys[event.keyCode] = true;
    var keyCode = event.keyCode.toString();
    if (g.player === null) {
        switch (keyCode) {
            case KEY_ENTER:
                g.mainMenu.submit();
                break;
            case KEY_DOWN:
                g.mainMenu.cursorDown();
                break;
            case KEY_UP:
                g.mainMenu.cursorUp();
                break;
        }
    } else {
        switch (keyCode) {
            case KEY_Z:
                g.player.dropNeutralWeight();
                break;
            case KEY_X:
                g.player.dropPositiveWeight();
                break;
            case KEY_C:
                g.player.dropNegativeWeight();
                break;
            case KEY_ENTER:
                g.player.collectNearbyWeights();
                break;
        }
    }
}

function registerKeyUp(event) {
    preventDefault(event);
    g.pressedKeys[event.keyCode] = false;
}

function handleKeys() {
    for (var key in g.pressedKeys) {
        if (g.pressedKeys.hasOwnProperty(key) && g.pressedKeys[key]) {
            keyCurrentlyDownAction(key);
        }
    }
}

function keyCurrentlyDownAction(keyCode) {
    // React to keyboard input:
    if (g.player !== null) {
        switch (keyCode) {
            case KEY_UP:
                g.player.jump();
                break;
            case KEY_LEFT:
                g.player.walkLeft();
                break;
            case KEY_RIGHT:
                g.player.walkRight();
                break;
        }
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

function drawRoundedRect(x, y, width, height, borderRadius) {
    g.context.strokeStyle = "black";
    g.context.lineWidth = 3;
    g.context.fillStyle = "white";
    g.context.beginPath();
    var circleLeft = Math.PI;
    var circleTop = 3 * Math.PI / 2;
    var circleRight = 0;
    var circleBottom = Math.PI / 2;
    var x2 = x + width;
    var y2 = y + height;
    var arcX = x + borderRadius;
    var arcY = y + borderRadius;
    var arcX2 = x2 - borderRadius;
    var arcY2 = y2 - borderRadius;
    // Upper left corner
    g.context.arc(arcX, arcY, borderRadius, circleLeft, circleTop);
    g.context.lineTo(arcX2, y);
    // Upper right corner
    g.context.arc(arcX2, arcY, borderRadius, circleTop, circleRight);
    g.context.lineTo(x2, arcY);
    // Lower right corner
    g.context.arc(arcX2, arcY2, borderRadius, circleRight, circleBottom);
    g.context.lineTo(arcX, y2);
    // Lower left corner
    g.context.arc(arcX, arcY2, borderRadius, circleBottom, circleLeft);
    g.context.closePath();
    g.context.stroke();
    g.context.fill();
}

function drawMessageBox(x, y, borderRadius, fontHeight, text) {
    var textBlock = new TextBlock(fontHeight, 6, text);
    var width = textBlock.width + 2 * borderRadius;
    var height = textBlock.height + 2 * borderRadius;
    drawRoundedRect(x, y, width, height, borderRadius);
    textBlock.drawAt(x + borderRadius, y + borderRadius);
}

function drawCenteredMessageBox(borderRadius, fontHeight, text) {
    var textBlock = new TextBlock(fontHeight, 6, text);
    var width = textBlock.width + 2 * borderRadius;
    var height = textBlock.height + 2 * borderRadius;
    var centered = alignToCenter(width, height, SCREEN_WIDTH, SCREEN_HEIGHT);
    drawRoundedRect(centered.x, centered.y, width, height, borderRadius);
    textBlock.drawAt(centered.x + borderRadius, centered.y + borderRadius);
}

function drawRect(x, y, width, height) {
    drawGenericRect(x, y, width, height, "black", 3, "white");
}

function drawPlus(x, y, size) {
    g.context.strokeStyle = "black";
    g.context.lineWidth = 2;
    g.context.beginPath();
    g.context.moveTo(x, y - size);
    g.context.lineTo(x, y + size);
    g.context.stroke();
    drawMinus(x, y, size);
}

function drawMinus(x, y, size) {
    g.context.strokeStyle = "black";
    g.context.lineWidth = 2;
    g.context.beginPath();
    g.context.moveTo(x - size, y);
    g.context.lineTo(x + size, y);
    g.context.stroke();
}

function clearScreen() {
    g.context.fillStyle = GAME_BG_COLOR;
    g.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function alignToCenter(width, height, containerWidth, containerHeight) {
    console.assert(containerWidth >= width, "Container is not wide enough");
    console.assert(containerHeight >= height, "Container is not tall enough");
    return {
        x: (containerWidth - width) / 2,
        y: (containerHeight - height) / 2
    };
}

function isUnaffectedByCharge(entity) {
    return isUndefined(entity.charge) ||
           isUndefined(entity.mass) ||
           entity.charge === 0;
}

function coulombsLawAcceleration(entity, other) {
    if (isUnaffectedByCharge(entity) || isUnaffectedByCharge(other)) {
        return null;
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

function distanceBetween(entity, other) {
    return Math.sqrt(squaredDistanceBetween(entity, other));
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

function updateSwitches() {
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        if (currentEntity.type === ":switch") {
            var isCollidingWithAnyWeight = false;
            for (var j = 0; j < g.entities.length; j++) {
                var otherEntity = g.entities[j];
                if (otherEntity.type === ":weight" &&
                    currentEntity.hitbox.intersect(otherEntity.hitbox) !== null) {
                    isCollidingWithAnyWeight = true;
                    currentEntity.turnOn();
                    break;
                }
            }
            if (!isCollidingWithAnyWeight) {
                currentEntity.turnOff();
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
        if (currentEntity.isSolid && otherEntity.isSolid) {
            currentEntity.hitbox.updateColliding(otherEntity.hitbox, intersection);
            if (intersection !== null) {
                g.intersections.push(intersection);
                currentEntity.hitbox.collisionCorrect(otherEntity.hitbox);
            }
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

function removeEntity(entity) {
    var index = g.entities.indexOf(entity);
    if (index !== -1) {
        g.entities.splice(index, 1);
    }
}

function draw() {
    window.requestAnimationFrame(draw);
    handleKeys();
    clearScreen();
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        currentEntity.draw();
        if (!isUndefined(currentEntity.mass)) {
            // All entities with mass are affected by gravity
            currentEntity.yAccelerate(GRAVITATIONAL_ACCEL);
        }
        if (!isUndefined(currentEntity.move)) {
            currentEntity.move();
        }
    }
    applyCoulombsLaw();
    collisionDetect();
    updateSwitches();
    for (var i = 0; i < g.messageBoxes.length; i++) {
        g.messageBoxes[i].draw();
    }
    // All hitboxes should be drawn after entities are finished drawing
    if (DEBUG_MODE) {
        for (var i = 0; i < g.entities.length; i++) {
            g.entities[i].hitbox.draw();
        }
        for (var i = 0; i < g.intersections.length; i++) {
            g.intersections[i].draw();
        }
    }
}

function loadLevel(levelNumber) {
    g.entities = [];
    g.intersections = [];
    g.messageBoxes = [];
    switch (levelNumber) {
        case 0:
            g.player = new Player(200, 170);
            g.entities.push(g.player);
            g.entities.push(new Wall(180, 280, 10, 80));
            g.entities.push(new Wall(260, 280, 30, 60));
            g.entities.push(new Wall(340, 280, 25, 70));
            g.entities.push(new Wall(420, 280, 25, 100));
            g.entities.push(new Wall(380, 330, 100, 20));
            g.entities.push(new Wall(100, SCREEN_HEIGHT - 100, SCREEN_WIDTH - 200, 20));
            // Ground
            g.entities.push(new Wall(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20));
            var door0 = new Wall(500, 280, 10, 80);
            g.entities.push(door0);
            g.entities.push(new Switch(
                180, SCREEN_HEIGHT - 102, 50, 4,
                {door: door0},
                function(targets) {
                    removeEntity(targets.door);
                },
                function(targets) {
                    g.entities.push(targets.door);
                }
            ));
            break;
    }
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
        case "4-mixed-c":
            g.entities.push(new Weight(1, 5, 200, 200));
            g.entities.push(new Weight(1, 5, 250, 200));
            g.entities.push(new Weight(1, -5, 200, 260));
            g.entities.push(new Weight(1, 5, 250, 260));
            break;
        case "1-neutral":
            g.entities.push(new Weight(1, 0, 200, 200));
            break;
    }
}

function testMessageBox(text) {
    g.messageBoxes.push({
        draw: function() {
            drawMessageBox(200, 250, 14, 12, text);
        }
    });
}

function setup() {
    var canvas = document.getElementById("screen");
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    g.context = canvas.getContext("2d");
    // Context must exist before instantiating main menu
    g.mainMenu = new MainMenu();
    g.messageBoxes.push(g.mainMenu);
    window.addEventListener("keydown", registerKeyDown);
    window.addEventListener("keyup", registerKeyUp);
    draw();
}
