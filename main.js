(function () {
  const options = {
    gridSize: [15, 15],
    margin: 100,
  };

  const container = document.createElement("div");
  container.classList.add("container");
  container.style.height = `${window.innerHeight - options.margin}px`;
  container.style.width = `${
    ((window.innerHeight - options.margin) / options.gridSize[1]) *
    options.gridSize[0]
  }px`;

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
    tile.addEventListener("click", mouseClick);

    function mouseOver() {
      dot.classList.add("dotActive");

      tile.addEventListener("mouseleave", () => {
        dot.classList.remove("dotActive");

        tile.removeEventListener("mouseleave", mouseOver);
      });
    }

    function mouseClick() {
      console.log(x, y);
    }
    return tile;
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
