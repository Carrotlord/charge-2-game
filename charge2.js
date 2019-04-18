var g = {
    context: null,
    canvas: null,
    editor: null,
    player: null,
    mainMenu: null,
    currentLevel: null,
    entities: [],
    inactiveEntities: [],
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

function correctMouseCoordinates(oldX, oldY) {
    var canvasRect = g.canvas.getBoundingClientRect();
    return {
        x: oldX - canvasRect.left,
        y: oldY - canvasRect.top
    };
}

function registerMouseDown(event) {
    if (g.editor !== null) {
        var coords = correctMouseCoordinates(event.clientX, event.clientY);
        g.editor.receiveMousePosition(coords.x, coords.y);
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

function drawEmptyCircle(x, y, radius) {
    g.context.beginPath();
    g.context.strokeStyle = "black";
    g.context.lineWidth = 2;
    g.context.arc(x, y, radius, 0, 2 * Math.PI);
    g.context.stroke();
}

function drawDotCircle(x, y) {
    drawEmptyCircle(x, y, 8);
    drawEmptyCircle(x, y, 1);
}

function drawCrossCircle(x, y) {
    var size = 6;
    g.context.strokeStyle = "black";
    g.context.lineWidth = 2;
    g.context.beginPath();
    g.context.moveTo(x + size, y - size);
    g.context.lineTo(x - size, y + size);
    g.context.stroke();
    g.context.beginPath();
    g.context.moveTo(x - size, y - size);
    g.context.lineTo(x + size, y + size);
    g.context.stroke();
    drawEmptyCircle(x, y, 8);
}

function drawTiling(x, y, xOffset, yOffset, xSpacing, ySpacing, maxX, maxY, drawTile) {
    for (var currentX = x + xOffset; currentX < maxX; currentX += xSpacing) {
        for (var currentY = y + yOffset; currentY < maxY; currentY += ySpacing) {
            drawTile(currentX, currentY);
        }
    }
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

function drawArrow(x, y, rotationAngle) {
    var arrowHeadWidth = 8;
    var arrowHeadHeight = 6;
    var arrowTailHeight = 16;
    var arrowTailOffset = 2;
    var centerY = y + (arrowTailHeight + arrowTailOffset) / 2;
    g.context.strokeStyle = "black";
    g.context.fillStyle = "black";
    g.context.lineWidth = 2;
    g.context.translate(x, centerY);
    g.context.rotate(rotationAngle);
    g.context.translate(-x, -centerY);
    // Draw head of arrow
    g.context.beginPath();
    g.context.moveTo(x, y);
    g.context.lineTo(x - arrowHeadWidth / 2, y + arrowHeadHeight);
    g.context.lineTo(x + arrowHeadWidth / 2, y + arrowHeadHeight);
    g.context.closePath();
    g.context.fill();
    // Draw tail of arrow
    g.context.beginPath();
    g.context.moveTo(x, y + arrowTailOffset);
    g.context.lineTo(x, y + arrowTailHeight + arrowTailOffset);
    g.context.stroke();
    // Undo transformations
    g.context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawStar(x, y, sideLength) {
    g.context.fillStyle = "black";
    g.context.beginPath();
    g.context.moveTo(x, y);
    var angles = [-72, 72, 0, 144, 72, -144, 144, -72, -144];
    for (var i = 0; i < angles.length; i++) {
        var currentVector = convertMagnitudeAngleToVector(sideLength, toRadians(angles[i]));
        x += currentVector.xComponent;
        y += currentVector.yComponent;
        g.context.lineTo(x, y);
    }
    g.context.closePath();
    g.context.fill();
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

function applyFields() {
    pairwiseAction(function(currentEntity, otherEntity) {
        if (!isUnaffectedByCharge(otherEntity) &&
            currentEntity.hitbox.intersect(otherEntity.hitbox) !== null) {
            // Apply Lorentz force
            if (currentEntity.type === ":field") {
                var forceMagnitude = otherEntity.charge * currentEntity.strength;
                // Since electric fields with an angle of 0 point upwards, and
                // vectors with an angle of 0 point right, we need to subtract
                // pi/2 from the rotation angle of the field.
                var accelVector = convertMagnitudeAngleToVector(
                    forceMagnitude / otherEntity.mass,
                    currentEntity.rotationAngle - Math.PI / 2
                );
                otherEntity.xAccelerate(accelVector.xComponent);
                otherEntity.yAccelerate(accelVector.yComponent);
            } else if (currentEntity.type === ":magnetic_field") {
                var velocityVector = new Vector(otherEntity.xVel, otherEntity.yVel);
                var forceAngle = velocityVector.getAngle() + Math.PI / 2;
                var forceMagnitude = velocityVector.getMagnitude() *
                                     currentEntity.strength * otherEntity.charge;
                var accelVector = convertMagnitudeAngleToVector(
                    forceMagnitude / otherEntity.mass,
                    forceAngle
                );
                otherEntity.xAccelerate(accelVector.xComponent);
                otherEntity.yAccelerate(accelVector.yComponent);
            }
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
        if (!isUndefined(currentEntity.collect) &&
            g.player.hitbox.intersect(currentEntity.hitbox) !== null) {
            currentEntity.collect();
        }
    }
    applyCoulombsLaw();
    applyFields();
    collisionDetect();
    updateSwitches();
    for (var i = 0; i < g.messageBoxes.length; i++) {
        g.messageBoxes[i].draw();
    }
    for (var i = 0; i < g.inactiveEntities.length; i++) {
        g.inactiveEntities[i].draw();
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
    g.currentLevel = levelNumber;
    g.entities = [];
    g.intersections = [];
    g.messageBoxes = [];
    switch (levelNumber) {
        case -1:
            loadDebugRoom2();
            break;
        case 0:
            loadDebugRoom();
            break;
        case 1:
            loadLevel1();
            break;
        case 2:
            loadLevel2();
            break;
        case 3:
            loadLevel3();
            break;
        default:
            endGame();
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

function testDrawFunction(drawFunction) {
    g.messageBoxes.push({draw: drawFunction});
}

function setup() {
    var canvas = document.getElementById("screen");
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    g.canvas = canvas;
    g.context = canvas.getContext("2d");
    // Context must exist before instantiating main menu
    g.mainMenu = new MainMenu();
    g.messageBoxes.push(g.mainMenu);
    window.addEventListener("keydown", registerKeyDown);
    window.addEventListener("keyup", registerKeyUp);
    g.canvas.addEventListener("mousedown", registerMouseDown);
    draw();
}
