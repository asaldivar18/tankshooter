var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})
io.sockets.on('connection', socket => {
    console.log("new connection: " + socket.id)
    socket.on("incomingTank", data => {
        socket.broadcast.emit("incomingTank", data)
    })
    socket.on("incomingMissles", data => {
        socket.broadcast.emit("incomingMissles", data);
    })

})
http.listen(3000, function() {
    console.log("Listening on port 3000");
})