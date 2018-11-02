var exports = module.exports = {};
let rooms = 0;
var numClients = 0;

/**
 * Return available room
 */
exports.getRoom = () => {
    return "room" + rooms;
}
exports.newClient = () => {
    numClients++
}

/**
 * Return new Room
 */
exports.createRoom = () => {
    return "room" + ++rooms
}

/**
 * Number of clients
 */
exports.numClients = numClients;