import SocketIO from "socket.io/lib/index.js";
const io = SocketIO.listen(8000);

const serverSettings = {
  gridSize: [15, 15],
};
const memory = {
  users: [
    {
      id: "bot1",
      location: [4, 5],
    },
  ],
};

function findUser(user) {
  return memory.users.find((currentUser) => currentUser.id === user.id);
}

function createUser(id) {
  return {
    id: id,
    location: [undefined, undefined],
  };
}

function declareUser(socket) {
  const userToDeclare = createUser(socket.id);
  memory.users.push(userToDeclare);

  socket.emit("declareUser", userToDeclare);
  return true;
}

function placeUser(socket, [x, y]) {
  const userToPlace = memory.users.find((user) => user.id === socket.id);

  userToPlace.location[0] = x;
  userToPlace.location[1] = y;

  socket.emit("placeUser", userToPlace);
}

function validateRequestMove(requester, moverId, location) {
  if (location[0] > serverSettings.gridSize[0] || location[0] < 0) return false;
  if (location[1] > serverSettings.gridSize[1] || location[1] < 0) return false;
  return true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

io.on("connection", (socket) => {
  io.emit("serverConnection", serverSettings, memory.users);

  declareUser(socket);
  placeUser(socket, [
    getRandomInt(serverSettings.gridSize[0]),
    getRandomInt(serverSettings.gridSize[1]),
  ]);

  socket.on("requestMove", (requesterId, moverId, location) => {
    if (validateRequestMove(requesterId, moverId, location)) {
      const user = memory.users.find((user) => user.id === socket.id);
      user.location[0] = location[0];
      user.location[1] = location[1];

      socket.emit("moveUser", user);
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

  socket.on("disconnect", () => {
    memory.users.splice(
      memory.users.indexOf((user) => user.id === socket.id),
      1
    );

    socket.emit(findUser(socket.id));
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
