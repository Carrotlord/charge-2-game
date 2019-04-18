function MainMenu() {
    this.width = 300;
    this.height = 280;
    this.borderRadius = 14;
    var centered = alignToCenter(this.width, this.height, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.x = centered.x;
    this.y = centered.y;
    this.titleBlock = new TextBlock(36, 0, "Charge 2");
    var centeredTitle = alignToCenter(this.titleBlock.width, 0, this.width, 0);
    this.titleX = this.x + centeredTitle.x;
    this.titleY = this.y + this.borderRadius;
    this.helperBlock = new TextBlock(12, 0, "  Press ENTER to select choice.");
    var centeredHelper = alignToCenter(this.helperBlock.width, 0, this.width, 0);
    this.helperX = this.x + centeredHelper.x;
    var helperPadding = 20;
    this.helperY = this.titleY + this.titleBlock.height + helperPadding;
    this.menuContentBlock = new TextBlock(16, 15,
        "Start New Game\nLevel Select\nLevel Editor\nDebug Rooms\nQuit"
    );
    var centeredMenuContent = alignToCenter(
        this.menuContentBlock.width,
        this.menuContentBlock.height,
        this.width,
        this.height + this.titleBlock.height + this.helperBlock.height + helperPadding
    );
    this.menuContentX = this.x + centeredMenuContent.x;
    this.menuContentY = this.y + centeredMenuContent.y;
    this.cursorMin = 0;
    this.cursorMax = this.menuContentBlock.lines.length - 1;
    this.cursorState = this.cursorMin;
}

MainMenu.prototype.drawCursor = function() {
    var cursorX = this.menuContentX - 24;
    var cursorY = this.menuContentY + this.menuContentBlock.fontHeight / 3 + this.cursorState *
                  (this.menuContentBlock.fontHeight + this.menuContentBlock.textPadding);
    var cursorWidth = 16;
    var cursorHeight = 10;
    g.context.beginPath();
    g.context.moveTo(cursorX, cursorY);
    g.context.lineTo(cursorX + cursorWidth, cursorY + cursorHeight / 2);
    g.context.lineTo(cursorX, cursorY + cursorHeight);
    g.context.closePath();
    g.context.fillStyle = "black";
    g.context.fill();
}

MainMenu.prototype.cursorUp = function() {
    this.cursorState--;
    if (this.cursorState < this.cursorMin) {
        this.cursorState = this.cursorMax;
    }
}

MainMenu.prototype.cursorDown = function () {
    this.cursorState++;
    if (this.cursorState > this.cursorMax) {
        this.cursorState = this.cursorMin;
    }
}

MainMenu.prototype.submit = function() {
    switch (this.cursorState) {
        case 0:
            loadLevel(1);
            break;
        case 2:
            loadEditor();
            break;
        case 3:
            loadLevel(0);
            break;
        case 4:
            g.messageBoxes = [{
                draw: function() {
                    drawCenteredMessageBox(14, 12, "Thanks for playing!");
                }
            }];
            break;
    }
}

MainMenu.prototype.draw = function() {
    drawRoundedRect(this.x, this.y, this.width, this.height, this.borderRadius);
    this.titleBlock.drawAt(this.titleX, this.titleY);
    this.helperBlock.drawAt(this.helperX, this.helperY);
    this.menuContentBlock.drawAt(this.menuContentX, this.menuContentY);
    this.drawCursor();
}

function TextBlock(fontHeight, textPadding, text) {
    this.fontHeight = fontHeight;
    this.textPadding = textPadding;
    this.lines = text.split("\n");
    this.width = 0;
    this.font = this.fontHeight.toString() + "px " + DIALOGUE_FONT;
    g.context.font = this.font;
    for (var i = 0; i < this.lines.length; i++) {
        var line = this.lines[i];
        var currentWidth = g.context.measureText(line).width;
        if (currentWidth > this.width) {
            this.width = currentWidth;
        }
    }
    this.height = this.getLineYOffset(this.lines.length - 1);
}

TextBlock.prototype.getLineYOffset = function(lineNumber) {
    return (lineNumber + 1) * this.fontHeight + lineNumber * this.textPadding;
}

TextBlock.prototype.drawAt = function(x, y) {
    g.context.font = this.font;
    g.context.fillStyle = "black";
    for (var i = 0; i < this.lines.length; i++) {
        var line = this.lines[i];
        g.context.fillText(line, x, y + this.getLineYOffset(i));
    }
}
