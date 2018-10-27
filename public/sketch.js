// Keep track of our socket connection
var socket;
var opponentTank;
var playerTank;
var missles = [];
var incomingMissles = [];

function setup() {
    createCanvas(windowWidth * .95, windowHeight * .95);
    socket = io.connect('http://localhost:3000');
    opponentTank = new Tank(30, 20, false);
    playerTank = new Tank(30, height - height * .0625 - 20, true);
    socket.on("connect", function() {
        strokeWeight(10)
    })
    socket.on("incomingTank", tank => {
        //console.log(tank.tank.xpos);
        opponentTank.xpos = tank.tank.xpos
    })
    socket.on("incomingMissles", incoming => {
        //console.log(incoming)
        var tmp = new Missle(incoming.x, incoming.y, incoming.isPlayer)
        incomingMissles.push(tmp);
    })
    setInterval(createMissles, 1000);
}

function draw() {
    clear()
    background(255, 0, 160);
    playerTank.display()
    opponentTank.display()
    for (let i = 0; i < missles.length; i++) {
        missles[i].display()
        missles[i].move();
        //console.log(missles[i])
    }
    for (let i = 0; i < incomingMissles.length; i++) {
        incomingMissles[i].display()
        incomingMissles[i].move();
    }
    if (keyIsDown(LEFT_ARROW)) {
        playerTank.moveLeft()
        var incomingTank = {
            tank: playerTank
        }
        socket.emit("incomingTank", incomingTank);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        playerTank.moveRight();
        var incomingTank = {
            tank: playerTank
        }
        socket.emit("incomingTank", incomingTank);
    }
}

function createMissles() {
    missles.push(new Missle(playerTank.point.x, playerTank.point.y, playerTank.isPlayer));
    var tmp = new Missle(playerTank.point.x, opponentTank.point.y, false)
    socket.emit("incomingMissles", tmp);
}


/**
 * Missle
 */
class Missle {
    constructor(x, y, isPlayer) {
        this.isPlayer = isPlayer;
        this.x = x;
        this.y = y;
        //console.log(this.tank);

    }
    display() {
        if (this.isPlayer) {
            ellipse(this.x, this.y, 6, 6)
        } else {
            ellipse(this.x, this.y, 6, 6)

        }
    }
    move() {
        if (this.isPlayer) {
            this.y -= 1;
        } else {
            this.y += 1;
        };
    }
}

/**
 * Point
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Tank
 */
class Tank {
    constructor(xpos, ypos, isPlayer) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.isPlayer = isPlayer;
        this.updatePoints();
    }
    display() {
        if (this.isPlayer) {
            rect(this.xpos, this.ypos, width * .125, height * .0625);
            line(this.xpos + (width * .125 / 2), this.ypos, this.xpos + (width * .125 / 2), this.ypos - ((width * 0.125) / 4))
        } else {
            rect(this.xpos, this.ypos, width * .125, height * .0625);
            line(this.xpos + (width * .125 / 2), this.ypos + height * .0625, this.xpos + (width * .125 / 2), this.ypos + height * .0625 + ((width * .125) / 4))
        }
    }
    updatePoints() {
        if (this.isPlayer) {
            this.point = new Point(this.xpos + (width * .125 / 2), this.ypos - ((width * 0.125) / 4))
        } else {
            this.point = new Point(this.xpos + (width * .125 / 2), this.ypos + height * .0625 + ((width * .125) / 4))
        }
    }

    moveLeft() {
        this.xpos = this.xpos - 30;
        this.updatePoints()
        if (this.xpos < 0) this.xpos = 0;
    }
    moveRight() {
        this.xpos = this.xpos + 30;
        this.updatePoints();
        if (this.xpos > width - width * .125) this.xpos = width - width * .125;
    }
}