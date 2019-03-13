function createRoomBorders() {
    var wallWidth = 20;
    g.entities.push(new Wall(0, SCREEN_HEIGHT - wallWidth, SCREEN_WIDTH, wallWidth));
    g.entities.push(new Wall(0, 0, wallWidth, SCREEN_HEIGHT));
    g.entities.push(new Wall(0, 0, SCREEN_WIDTH, wallWidth));
    g.entities.push(new Wall(SCREEN_WIDTH - wallWidth, 0, wallWidth, SCREEN_HEIGHT));
}

function loadDebugRoom() {
    g.entities.push(new Field(400, SCREEN_HEIGHT - 300, 150, 200, 0));
    g.entities.push(new Field(550, SCREEN_HEIGHT - 300, 150, 200, Math.PI / 3, 0.05));
    g.player = new Player(200, 170);
    g.entities.push(g.player);
    g.entities.push(new Wall(180, 280, 10, 40));
    g.entities.push(new Wall(260, 280, 30, 60));
    g.entities.push(new Wall(340, 280, 25, 70));
    g.entities.push(new Wall(420, 280, 25, 100));
    g.entities.push(new Wall(380, 330, 100, 20));
    g.entities.push(new Wall(100, SCREEN_HEIGHT - 100, SCREEN_WIDTH - 200, 20));
    // Ground
    g.entities.push(new Wall(0, SCREEN_HEIGHT - 20, SCREEN_WIDTH, 20));
    var door0 = new Wall(500, 280, 10, 40);
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
}

function loadLevel1() {
    DEBUG_MODE = false;
    var wallWidth = 20;
    g.player = new Player(200, 170);
    g.entities.push(g.player);
    var stairHeight = 35;
    var stairSpacing = 75;
    var stairStart = 250;
    var indexStart = 6;
    for (var i = indexStart; i >= 0; i--) {
        g.entities.push(new Wall(
            stairStart + i * stairSpacing,
            SCREEN_HEIGHT - wallWidth - (i + 1) * stairHeight,
            SCREEN_WIDTH - (stairStart + i * stairSpacing) - wallWidth,
            stairHeight
        ));
    }
    createRoomBorders();
    g.entities.push(new Goal(
        SCREEN_WIDTH - wallWidth - 30,
        SCREEN_HEIGHT - wallWidth - (indexStart + 1) * stairHeight - 20
    ));
}

function endGame() {
    g.messageBoxes = [{
        draw: function() {
            drawCenteredMessageBox(14, 12, "You have reached the end of the demo.\nThank you for playing!");
        }
    }];
}
