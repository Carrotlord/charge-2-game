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
