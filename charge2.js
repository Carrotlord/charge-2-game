var g = {
    context: null,
    player: {
        x: 200,
        y: 200,
        walkXVel: 5,
        walkYVel: 5
    }
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
            g.player.y += g.player.walkYVel;
            break;
        case KEY_UP:
            g.player.y -= g.player.walkYVel;
            break;
        case KEY_LEFT:
            g.player.x -= g.player.walkXVel;
            break;
        case KEY_RIGHT:
            g.player.x += g.player.walkXVel;
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

function drawRect(x, y, width, height) {
    g.context.strokeStyle = "black";
    g.context.lineWidth = 3;
    // Need to begin path to avoid player border
    // connecting with rectangle border
    g.context.beginPath();
    g.context.rect(x, y, width, height);
    g.context.stroke();
    g.context.fillStyle = "white";
    g.context.fill();
}

function drawPlayer() {
    drawCircle(g.player.x, g.player.y, 10);
}

function clearScreen() {
    g.context.fillStyle = GAME_BG_COLOR;
    g.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function draw() {
    window.requestAnimationFrame(draw);
    clearScreen();
    drawRect(20, 20, 40, 50);
    drawPlayer();
    drawRect(100, 20, 40, 50);
}

function setup() {
    var canvas = document.getElementById("screen");
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    g.context = canvas.getContext("2d");
    window.addEventListener("keydown", keyDownAction);
    draw();
}
