function createRoomBorders() {
    var wallWidth = 20;
    g.entities.push(new Wall(0, SCREEN_HEIGHT - wallWidth, SCREEN_WIDTH, wallWidth));
    g.entities.push(new Wall(0, 0, wallWidth, SCREEN_HEIGHT));
    g.entities.push(new Wall(0, 0, SCREEN_WIDTH, wallWidth));
    g.entities.push(new Wall(SCREEN_WIDTH - wallWidth, 0, wallWidth, SCREEN_HEIGHT));
}

function spawnPlayer(x, y) {
    g.player = new Player(x, y);
    g.entities.push(g.player);
}

function spawnDoorSwitch(x, y, width, height, targetDoor) {
    g.entities.push(new Switch(
        x, y, width, height,
        {door: targetDoor},
        function(targets) {
            removeEntity(targets.door);
        },
        function(targets) {
            g.entities.push(targets.door);
        }
    ));
}

function loadDebugRoom() {
    g.entities.push(new Field(400, SCREEN_HEIGHT - 300, 150, 200, 0));
    g.entities.push(new Field(550, SCREEN_HEIGHT - 300, 150, 200, Math.PI / 3, 0.05));
    spawnPlayer(200, 170);
    g.player.positiveWeights = 5;
    g.player.negativeWeights = 5;
    g.player.neutralWeights = 5;
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
    spawnDoorSwitch(180, SCREEN_HEIGHT - 102, 50, 4, door0);
}

function loadDebugRoom2() {
    g.entities.push(new Field(400, SCREEN_HEIGHT - 220, 150, 200, 0));
    g.entities.push(new Field(550, SCREEN_HEIGHT - 220, 150, 200, Math.PI / 3, 0.05));
    g.entities.push(new MagneticField(100, SCREEN_HEIGHT - 220, 150, 200, ":into_screen"));
    g.entities.push(new MagneticField(250, SCREEN_HEIGHT - 220, 150, 200, ":out_of_screen"));
    spawnPlayer(200, 170);
    g.player.positiveWeights = 100;
    g.player.negativeWeights = 100;
    g.player.neutralWeights = 100;
    createRoomBorders();
}

function loadLevel1() {
    DEBUG_MODE = false;
    var wallWidth = 20;
    spawnPlayer(200, 170);
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

function loadLevel2() {
    spawnPlayer(200, 170);
    g.entities.push(new Wall(500, 0, 20, SCREEN_HEIGHT - 100));
    var door = new Wall(500, SCREEN_HEIGHT - 100, 20, 80);
    g.entities.push(door);
    createRoomBorders();
    g.entities.push(new Weight(1, 0, 150, 170));
    spawnDoorSwitch(350, SCREEN_HEIGHT - 22, 50, 4, door);
    g.entities.push(new Goal(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 50));
}

function loadLevel3() {
    g.entities.push(new Field(350, 20, 50, SCREEN_HEIGHT - 40, 0));
    spawnPlayer(200, 170);
    g.entities.push(new Wall(500, 0, 20, SCREEN_HEIGHT - 100));
    var door = new Wall(500, SCREEN_HEIGHT - 100, 20, 80);
    g.entities.push(door);
    createRoomBorders();
    g.entities.push(new Weight(1, 10, 150, 170));
    spawnDoorSwitch(350, 18, 50, 4, door);
    g.entities.push(new Goal(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 50));
}

function endGame() {
    g.messageBoxes = [{
        draw: function() {
            drawCenteredMessageBox(14, 12, "You have reached the end of the demo.\nThank you for playing!");
        }
    }];
}

function loadEditor() {
    g.entities = [];
    g.intersections = [];
    g.messageBoxes = [];
    g.inactiveEntities = [];
    g.editor = new Editor();
}
