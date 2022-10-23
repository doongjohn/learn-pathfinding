// infinite loop
function loop() {
  grid.draw()
  path.draw()
  requestAnimationFrame(loop)
}

function waitInit() {
  if (jsonMapData !== null) {
    // init map data
    grid.forEach((x, y) => {
      const extraCost = jsonMapData.extra_cost[y][x]
      const walkable = jsonMapData.walkable[y][x]
      if (extraCost == 0) {
        grid.set(x, y, new Tile())
      } else if (extraCost == 20) {
        grid.set(x, y, new Tile('grass'))
      } else if (extraCost == 50) {
        grid.set(x, y, new Tile('water'))
      }
      if (walkable == false) {
        grid.set(x, y, new Tile('wall'))
      }
    })
    const startingPos = jsonMapData.startingPoint
    const destinationPos = jsonMapData.destinationPoint
    grid.set(startingPos.x, startingPos.y, new Tile('starting'))
    grid.set(destinationPos.x, destinationPos.y, new Tile('destination'))

    // start loop
    loop()
    return
  }
  requestAnimationFrame(waitInit)
}

waitInit()
