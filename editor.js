function Editor() {
    this.startAreaX = null;
    this.startAreaY = null;
}

Editor.prototype.receiveMousePosition = function(x, y) {
    if (this.startAreaX !== null &&
        this.startAreaY !== null &&
        x > this.startAreaX &&
        y > this.startAreaY) {
        g.inactiveEntities.push(new Wall(
            this.startAreaX,
            this.startAreaY,
            x - this.startAreaX,
            y - this.startAreaY
        ));
        this.startAreaX = null;
        this.startAreaY = null;
    } else {
        this.startAreaX = x;
        this.startAreaY = y;
    }
    this.refreshSource();
}

Editor.prototype.refreshSource = function() {
    var output = "";
    for (var i = 0; i < g.inactiveEntities.length; i++) {
        output += g.inactiveEntities[i].toSource() + "\n";
    }
    document.getElementById("source-output").innerHTML = output;
}
