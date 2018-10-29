// Tank
// Implementing sockets.io & p5.js
// Adrian Saldivar 
// October 27 2018

// Global Variables
var socket;
var opponentTank;
var playerTank;
var missles = [];
var incomingMissles = [];
var isConnected;
var kills = 0
var deaths = 0;

function setup() {
    var canvas = createCanvas(width * .50, height * .50);
    canvas.parent("Container")
    socket = io.connect('https://guccitankgang888.herokuapp.com/' || 'http://localhost:3000');
    init();
}
/**
 * Setup Tanks, and websocket connections
 */
function init() {
    opponentTank = new Tank(30, 20, false);
    playerTank = new Tank(30, height - height * .0625 - 20, true);

    socket.on("connect", function() {
        strokeWeight(10)
    })
    socket.on("incomingTank", tank => {
        opponentTank.xpos = tank.tank.xpos
        opponentTank.health = tank.tank.health
        if (tank.tank.health == 100.1) {
            document.getElementById("kills").innerHTML = ++kills
        }
        document.getElementById("oHealth").innerHTML = Math.floor(tank.tank.health)
        document.getElementById("oHealth").style.width = Math.floor(tank.tank.health) + "%";

    })
    socket.on("incomingMissles", incoming => {
        var missle = new Missle(incoming.x, incoming.y, incoming.isPlayer)
        incomingMissles.push(missle);
    })

    setInterval(createMissles, 250);
}

/**
 * Updates Canvas
 */
function draw() {
    clear()
    background(51, 204, 51)

    playerTank.display()
    opponentTank.display()
    for (let i = 0; i < missles.length; i++) {
        missles[i].display()
        missles[i].move();
        if (checkContact(missles[i]))
            missles.shift();
    }
    for (let i = 0; i < incomingMissles.length; i++) {
        incomingMissles[i].display()
        incomingMissles[i].move();
    }
    if (incomingMissles.length > 100)
        incomingMissles.shift();

    var contact = incomingMissles.filter(value => {
        if (value.y == playerTank.ypos &&
            value.x > playerTank.xpos &&
            value.x < playerTank.xpos + ((width * .125 / 2) * 2)
        ) {
            console.log("hit")
            playerTank.hit(Math.floor(Math.random() * 10) + 5)
            var incomingTank = {
                tank: playerTank
            }
            socket.emit("incomingTank", incomingTank);
            incomingMissles.shift();

        } else if (value.y > screen.height * .50) {
            incomingMissles.shift()
        }
    })
    setupHandlers();
}



/**
 * Setup key handlers & listeners  
 */
function setupHandlers() {
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

/**
 * Fires missles from playertank and send missle obj to server
 */
function mousePressed() {
    missles.push(new Missle(playerTank.point.x, playerTank.point.y, playerTank.isPlayer));
    socket.emit("incomingMissles", new Missle(playerTank.point.x, opponentTank.point.y, false));
}

function createMissles() {

}

/**
 * Check if player missle made contact with opponent Tank
 * @param {Missle} value 
 */
function checkContact(value) {
    if (value.y == opponentTank.ypos &&
        value.x > opponentTank.xpos &&
        value.x < opponentTank.xpos + ((width * .125 / 2) * 2)) {
        return true
    } else if (value.y > screen.height * .50) {
        return true
    }
    return false;
}