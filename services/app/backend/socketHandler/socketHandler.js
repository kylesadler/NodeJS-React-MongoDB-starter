const ioUtil = require("../io.js.js.js");
const socketUtil = require("../websocket.js.js.js");
const socketFunctions = require("./socketFunctions");

// used to communicate with Python on Teensy (used because Python socket io library doesn't work)
// TODO make custom Python library
var websocket = null;
var nanoSocket = null;
var io = null;

while (io === null || websocket === null) {
  io = ioUtil.io();
  websocket = socketUtil.websocket();
}

exports.handle = (socket) => {
  console.log("sockeio connected");
  socketFunctions.forEach(({ event, handler }) => {
    socket.on(event, handler({ socket, nanoSocket }));
  });
};

websocket.on("connection", (ws) => {
  console.log("websocket connected");
  ws.send("connected to server");
  nanoSocket = ws;
});
