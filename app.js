var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
//var room = require("./public/models/Room")
var api = require("./routes/api/score")
const path = require("path");


var list = {}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + "/public"));

app.get("/login/:id", function(req, res) {
    console.log("hello")
    res.sendFile(path.join(__dirname, "public/login.html"))

})


app.use('/api/', api)

io.sockets.on('connection', socket => {


    socket.on("joinGame", data => {
        let room = data["room"];
        let username = data["username"];
        let clientNum = io.sockets.adapter.rooms[room];
        console.log(clientNum);
        if (typeof clientNum !== "undefined") {
            if (clientNum.length == 1) {
                for (var clientId in io.sockets.adapter.rooms[room].sockets) {
                    var emeny = io.sockets.connected[clientId].nickname;
                }
                console.log("Here");
                socket.join(room);
                socket.nickname = username;
                matchup = username + " VS " + emeny;
                io.to(room).emit("host", matchup)
                io.to(room).emit("EnterGame", "OK");
                list[socket.id] = room;
            } else if (clientNum.length >= 2) {
                socket.emit("Full", "Full");
            }
        } else {
            socket.join(room);
            socket.nickname = username;
            console.log("There");
            matchup = "Waiting for the player";
            io.to(room).emit("host", matchup);
            io.to(room).emit("EnterGame", "OK");
            list[socket.id] = room;
        }

    })


    socket.on("incomingTank", data => {
        socket.to(data.room).emit("incomingTank", data)
    })

    socket.on("incomingMissles", data => {
        console.log(data);
        socket.to(data.room).emit("incomingMissles", data);
    })




    socket.on('disconnect', function() {
        let room = list[socket.id];
        console.log("dc" + room);
        io.to(room).emit("dc", "dc");
    });

})
http.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port 3000");
})