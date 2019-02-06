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

function keyDownAction(event) {
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

function collisionDetect() {
    g.intersections = [];
    g.player.hitbox.resetCollidingSides();
    for (var i = 0; i < g.entities.length; i++) {
        var currentEntity = g.entities[i];
        for (var j = 0; j < g.entities.length; j++) {
            var otherEntity = g.entities[j];
            // Check collisions with all entities except self
            if (currentEntity !== otherEntity) {
                // Draw the intersection
                var intersection = currentEntity.hitbox.intersect(otherEntity.hitbox);
                if (currentEntity === g.player) {
                    g.player.hitbox.updateColliding(otherEntity.hitbox, intersection);
                }
                if (intersection !== null) {
                    g.intersections.push(intersection);
                }
            }
        }
    }
}

function draw() {
    window.requestAnimationFrame(draw);
    clearScreen();
    drawRect(20, 20, 40, 50);
    for (var i = 0; i < g.entities.length; i++) {
        g.entities[i].draw();
    }
    // All hitboxes should be drawn after entities are finished drawing
    for (var i = 0; i < g.entities.length; i++) {
        g.entities[i].hitbox.draw();
    }
    for (var i = 0; i < g.intersections.length; i++) {
        g.intersections[i].draw();
    }
    drawRect(100, 20, 40, 50);
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
