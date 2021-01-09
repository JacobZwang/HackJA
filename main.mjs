import Express from "express";
import SocketIO from "socket.io/lib/index.js";
import Http from "http";

const app = Express();
const http = Http.Server(app);
const io = SocketIO(http);

app.use(Express.static("client"));

http.listen(3000, () => {
  console.log("listening on *:3000");
});

const serverSettings = {
  gridSize: [15, 15],
};

function validateRequestMove(requester, moverId, location) {
  if (location[0] > serverSettings.gridSize[0] || location[0] < 0) return false;
  if (location[1] > serverSettings.gridSize[1] || location[1] < 0) return false;
  return true;
}

io.on("connection", (socket) => {
  io.emit("serverConnection", serverSettings);
  socket.on("requestMove", (id, moverId, location) => {
    console.log(location);
    if (validateRequestMove(requester, moverId, location)) {
      socket.emit("moveUser", moverId, location);
    }
  });

  socket.on("broadcaster", () => {
    const broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");

    socket.on("watcher", () => {
      socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("disconnect", () => {
      socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
});
