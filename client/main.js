(function () {
  const socket = io.connect("http://localhost:8000");

  const options = {
    gridSize: [15, 15],
    margin: 100,
  };

  const memory = {
    users: [],
  };

  socket.on("serverConnection", (settings, users) => {
    console.log("it worked!");
    options.gridSize = settings.gridSize;
    memory.users = users;

    users.forEach((user) => {
      if (
        user.location[0] != undefined &&
        user.location[1] != undefined &&
        user.location != undefined
      ) {
        drawUserIcon(user);
      }
    });
  });

  socket.on("moveUser", (user) => {
    drawUserIcon(user);
  });

  socket.on("declareUser", (user) => {
    memory.users.push(user);
  });

  socket.on("placeUser", (user) => {
    const userToPlace = findUser(socket);

    userToPlace.location[0] = user.location[0];
    userToPlace.location[1] = user.location[1];
  });

  socket.on("disconnect", (user) => {
    undrawUserIcon(user);
    memory.users.splice(
      memory.users.indexOf((user) => user.id === socket.id),
      1
    );
  });

  const container = document.createElement("div");
  container.classList.add("container");
  container.style.height = `${window.innerHeight - options.margin}px`;
  container.style.width = `${
    ((window.innerHeight - options.margin) / options.gridSize[1]) *
    options.gridSize[0]
  }px`;

  function findUser(user) {
    return memory.users.find((currentUser) => currentUser.id === user.id);
  }

  function createRow() {
    const row = document.createElement("div");
    row.classList.add("row");
    row.style.gridTemplateColumns = `repeat(${options.gridSize[1]}, 1fr)`;
    row.style.height = `${
      parseInt(container.style.height.replace("px", "")) / options.gridSize[1]
    }px`;
    return row;
  }

  function createTile(x, y) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    const dot = document.createElement("div");
    dot.classList.add("dot");
    tile.appendChild(dot);

    tile.addEventListener("mouseover", mouseOver);

    function mouseOver() {
      dot.classList.add("dotActive");

      tile.addEventListener("click", mouseClick);
      tile.addEventListener("mouseleave", () => {
        dot.classList.remove("dotActive");

        tile.removeEventListener("mouseleave", mouseOver);
        tile.removeEventListener("click", mouseClick);
      });
    }

    function mouseClick() {
      requestMove(x, y);
    }
    return tile;
  }

  function createUserIcon() {
    const icon = document.createElement("div");
    icon.classList.add("icon");

    const video = document.createElement("video");
    icon.appendChild(video);

    return icon;
  }

  function drawUserIcon(user) {
    const location = tiles[user.location[0]][
      user.location[1]
    ].getElementsByClassName("dot")[0];

    location.appendChild(createUserIcon());
    location.classList.add("userOnTile");
  }

  function undrawUserIcon(user) {
    const location = tiles[user.location[0]][
      user.location[1]
    ].getElementsByClassName("dot")[0];

    location.removeChild(location.childNodes[0]);
  }

  function requestMove(x, y) {
    socket.emit("requestMove", [x, y]);
  }

  const tiles = Array.from({ length: options.gridSize[1] }, () =>
    container.appendChild(createRow())
  ).map((row, rowNum) =>
    new Array(options.gridSize[0])
      .fill()
      .map((_, colNum) => row.appendChild(createTile(colNum, rowNum)))
  );

  document.body.appendChild(container);
})();
