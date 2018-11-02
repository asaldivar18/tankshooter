var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var room = require("./public/models/Room")
var user = []
var matchup = ""



app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})


io.sockets.on('connection', socket => {
    //console.log(room.numClients)
    if (room.numClients == 0) {
        socket.join(room.createRoom());
        socket.emit('created', room);
    } else
    if (room.numClients == 1) {
        io.sockets.in(room.getRoom()).emit('join', room.getRoom());
        socket.join(room.getRoom());
        var roominfo = {
            room: room.getRoom(),
            user: user
        }
        socket.emit('joined', room.getRoom().user);
        console.log("test")
    } else { // max two clients
        socket.emit('full', room.getRoom());
    }



    room.numClients = room.numClients + 1;

    socket.on("incomingTank", data => {
        socket.broadcast.emit("incomingTank", data)

    })

    socket.on("incomingMissles", data => {
        console.log(data)
        socket.broadcast.emit("incomingMissles", data);
    })

    socket.on("username", data => {
        //console.log(data)
        user.push(data)
        if (user.length > 1)
            matchup = user[0] + " vs." + user[1]
        else
            matchup = "Waiting for 1 player..."
            //socket.broadcast.emit("username", data);
        io.to(room.getRoom()).emit("host", matchup)
    })


    socket.on('disconnect', function() {
        room.numClients = room.numClients - 1;
        matchup = ""
        user = []
        io.to(room.getRoom()).emit("dc", user)

    });

})
http.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port 3000");
})