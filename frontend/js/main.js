// infinite loop
function loop() {
  grid.draw()
  path.draw()
  requestAnimationFrame(loop)
}

function waitInit() {
  if (jsonMapData !== null) {
    // init grid
    initPath(jsonMapData.gridWidth, jsonMapData.gridHeight)
    initGrid(jsonMapData.gridWidth, jsonMapData.gridHeight)

    // init map data
    grid.forEach((x, y) => {
      const extraCost = jsonMapData.extraCost[y][x]
      const walkable = jsonMapData.walkable[y][x]
      if (extraCost == 0) {
        grid.set(x, y, '')
      } else if (extraCost == 20) {
        grid.set(x, y, 'grass')
      } else if (extraCost == 50) {
        grid.set(x, y, 'water')
      }
      if (walkable == false) {
        grid.set(x, y, 'wall')
      }
    })
    const startingPos = jsonMapData.startingPoint
    const destinationPos = jsonMapData.destinationPoint
    grid.set(startingPos.x, startingPos.y, 'starting')
    grid.set(destinationPos.x, destinationPos.y, 'destination')

    // start loop
    loop()
    return
  }
  requestAnimationFrame(waitInit)
}

waitInit()
