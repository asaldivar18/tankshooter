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
var input, roomInput, button, greeting, roomgreeting;
var username, roomname;
var name;
var isHost;
var uid


function setup() {
    var canvas = createCanvas(screen.width * .50, screen.height * .50);
    canvas.parent("Container")
    socket = io.connect()

    //    socket = io.connect('https://bbtankshooter.herokuapp.com/' || 'http://localhost:3000');
    init();
}
/**
 * Setup Tanks, and websocket connections
 */
function init() {
    start()
    button.addEventListener("click", createPlayer)


    socket.on("connect", function() {
        let numClients;
        strokeWeight(10)
    })


    socket.on("created", data => {


        isHost = true
    })
    socket.on("joined", data => {


        isHost = false

    })
    socket.on("matchup", data => {
        console.log(data)
    })
    socket.on("dc", data => {
        if (isConnected) {
            console.log(uid)

            var message = document.createElement("p")
            var message2 = document.createElement("p")
            message2.innerHTML = "Saving score..."
            message.style.fontWeight = "bold"
            message.innerHTML = "Opponent has left! You win!"
            document.getElementById("matchup").appendChild(message)
            document.getElementById("matchup").appendChild(message2)

            var token = {
                token: "adrian86023152"
            }


            $.ajax({
                url: "api/1.0",
                type: "POST",
                contentType: "application/JSON",
                headers: {
                    kills: kills,
                    deaths: deaths,
                    uid: uid,
                    token: token
                },
                success: () => {
                    message2.innerHTML = "Score saved"
                }
            })

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
        var missle = new Missle(incoming.missle.x, incoming.missle.y, incoming.missle.isPlayer)
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
                    tank: playerTank,
                    room: roomname
                }
                socket.emit("incomingTank", incomingTank);
                incomingMissles.shift();

            } else if (value.y > screen.height * .50) {
                incomingMissles.shift();
            }
        })
        setupHandlers();

    } else {
        textAlign(CENTER);
        textSize(50);
    }
}

function start() {
    roomInput = document.createElement("input")
    button = document.createElement("button")
    roomgreeting = document.createElement("h2")
    var breakln = document.createElement("br")
    roomgreeting.innerText = "Enter room"
    button.innerHTML = "Enter Battlefield"
    roomInput.setAttribute("id", "playerid")
    button.setAttribute("id", "namebtn")


    document.getElementById("start").appendChild(roomgreeting)
    document.getElementById("start").appendChild(roomInput)
    document.getElementById("start").appendChild(breakln)
    document.getElementById("start").appendChild(button)
}


function createPlayer() {
    var user = firebase.auth().currentUser;

    if (user != null) {
        user.providerData.forEach(function(profile) {
            username = profile.displayName;
            roomname = roomInput.value;
        });
    }
    let data = {
        "room": roomname,
        "username": username
    }
    socket.emit("joinGame", data);
    socket.on("Full", data => {
        alert("Room is full");
    })
    socket.on("EnterGame", data => {
            opponentTank = new Tank(30, 20, false);
            playerTank = new Tank(30, height - height * .0625 - 20, true);
            opponentTank.display()
            playerTank.display()
            $("#game").show();
            $("#start").hide()
            isConnected = true;
        })
        //$("#matchup").html(username)
    socket.on("host", name => {
            $("#matchup").html(name)
        })
        //socket.emit("username", username);

}



/**
 * Setup key handlers & listeners  
 */
function setupHandlers() {
    if (keyIsDown(LEFT_ARROW)) {
        playerTank.moveLeft()
        var incomingTank = {
            tank: playerTank,
            room: roomname
        }
        socket.emit("incomingTank", incomingTank);
    }

    if (keyIsDown(RIGHT_ARROW)) {
        playerTank.moveRight();
        var incomingTank = {
            tank: playerTank,
            room: roomname
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
        let missleobj = new Missle(playerTank.point.x, opponentTank.point.y, false);
        let obj = {
            missle: missleobj,
            room: roomname
        }
        socket.emit("incomingMissles", obj);
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