(function () {
  const options = {
    gridSize: [20, 20],
    margin: 100,
    backgroundColor: "rgb(5, 23, 29)",
  };

  document.body.style = `background-color: ${options.backgroundColor}`;

  const container = document.createElement("div");
  container.classList.add("container");
  container.style.height = `${window.innerHeight - options.margin}px`;
  container.style.width = `${
    ((window.innerHeight - options.margin) / options.gridSize[0]) *
    options.gridSize[1]
  }px`;

  function createRow() {
    const row = document.createElement("div");
    row.classList.add("row");
    return row;
  }

  function createTile() {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.gridTemplateColumns = `repeat(${options.gridSize}, 1fr)`;
    return tile;
  }

  const tiles = new Array(5)
    .fill(container.appendChild(createRow()))
    .map((row) => {
      for (i = 0; i < 10; i++) {
        row.appendChild(createTile());
      }
      return row;
    });

  document.body.appendChild(container);
})();
