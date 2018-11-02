// Tank
// Implementing sockets.io & p5.js
// Adrian Saldivar 
// October 27 2018

// Global Variables
var player;
var opponent;
var socket;
var opponentTank;
var playerTank;
var missles = [];
var incomingMissles = [];
var isConnected = false;
var kills = 0
var deaths = 0;
var input, button, greeting;
var username
var name
var isHost


function setup() {
    var canvas = createCanvas(screen.width * .50, screen.height * .50);
    canvas.parent("Container")
        //socket = io.connect()

    socket = io.connect('https://guccitankgang888.herokuapp.com/' || 'http://localhost:3000');
    init();
}
/**
 * Setup Tanks, and websocket connections
 */
function init() {

    socket.on("connect", function() {
        let numClients;
        strokeWeight(10)
    })


    socket.on("created", data => {
        start()
        button.addEventListener("click", createPlayer)


        isHost = true
    })
    socket.on("joined", data => {
        start()
        button.addEventListener("click", createPlayer)


        isHost = false

    })
    socket.on("dc", data => {
        if (isConnected) {
            var message = document.createElement("p")
            message.style.fontWeight = "bold"
            message.innerHTML = "Opponent has left! You win!"
            document.getElementById("matchup").appendChild(message)
        }
        isConnected = false
        $("#game").hide();
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
    if (isConnected) {
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

    } else {


        // input = createInput();
        // button = createButton('submit');
        // greeting = createElement('h2', 'Enter your name');
        //input.style.fontsize = '20px'
        //input.
        // input.position((windowWidth - width) / 2, (windowHeight) / 2);
        // button.position(input.x + input.width / 3, input.y + input.height * 2)
        // greeting.position(input.x, input.y - input.height * 2);
        // input.parent("start")
        // button.mousePressed(createPlayer);




        textAlign(CENTER);
        textSize(50);
    }
}

function start() {
    input = document.createElement("input")
    button = document.createElement("button")
    greeting = document.createElement("h2")
    var breakln = document.createElement("br")
    greeting.innerText = "Enter name"
    button.innerHTML = "Enter Battlefield"
    input.setAttribute("id", "playername")
    button.setAttribute("id", "namebtn")


    document.getElementById("start").appendChild(greeting)
    document.getElementById("start").appendChild(input)
    document.getElementById("start").appendChild(breakln)
    document.getElementById("start").appendChild(button)
}

function getOpponent() {

    return name
}

function createPlayer() {
    $("#start").hide()
    username = input.value
    $("#matchup").html(username)
    opponentTank = new Tank(30, 20, false);
    playerTank = new Tank(30, height - height * .0625 - 20, true);
    opponentTank.display()
    playerTank.display()
        // input.style("display", "none");
        // button.style("display", "none");
        // greeting.style("display", "none");
    $("#game").show();
    socket.on("host", name => {
        $("#matchup").html(name)
    })
    socket.emit("username", username);


    isConnected = true




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
    if (isConnected) {
        missles.push(new Missle(playerTank.point.x, playerTank.point.y, playerTank.isPlayer));
        socket.emit("incomingMissles", new Missle(playerTank.point.x, opponentTank.point.y, false));
    }
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