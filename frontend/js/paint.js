function onErase(x, y) {
  grid.set(x, y, new Tile())
  jsonMapData.extraCost[y][x] = 0
  jsonMapData.walkable[y][x] = true
}

function onPaint(x, y) {
  switch (paintMode) {
    case '':
      break
    case 'starting':
      const startingPos = jsonMapData.startingPoint
      onErase(startingPos.x, startingPos.y)
      grid.set(startingPos.x, startingPos.y, new Tile())
      grid.set(x, y, new Tile('starting'))
      jsonMapData.startingPoint = { x: x, y: y }
      break
    case 'destination':
      const destinationPos = jsonMapData.destinationPoint
      onErase(destinationPos.x, destinationPos.y)
      grid.set(destinationPos.x, destinationPos.y, new Tile())
      grid.set(x, y, new Tile('destination'))
      jsonMapData.destinationPoint = { x: x, y: y }
      break
    case 'wall':
      grid.set(x, y, new Tile('wall'))
      jsonMapData.walkable[y][x] = false
      break
    case 'grass':
      grid.set(x, y, new Tile('grass'))
      jsonMapData.extraCost[y][x] = 20
      break
    case 'water':
      grid.set(x, y, new Tile('water'))
      jsonMapData.extraCost[y][x] = 50
      break
    default:
      console.error('unknown paint mode: ' + paintMode)
  }
}

function onGridClick(mouseX, mouseY) {
  const canvasPos = screenToCanvasPosition(mouseX, mouseY)
  const gridPos = grid.canvasToGridPos(canvasPos.x, canvasPos.y)
  if (!grid.is_in_bounds(gridPos.x, gridPos.y)) {
    return
  }

  // reset path
  path.forEach((x, y) => {
    path.data[y][x] = false
  })

  if (['starting', 'destination'].includes(grid.data[gridPos.y][gridPos.x].type)) {
    // do not override starting or destination position
    return
  }

  if (mouseButton === 0) {
    onPaint(gridPos.x, gridPos.y)
  } else {
    onErase(gridPos.x, gridPos.y)
  }
}

let mouseDown = false
let mouseButton = 0
window.addEventListener('mousedown', (mouseEvent) => {
  mouseDown = true
  mouseButton = mouseEvent.button
  onGridClick(mouseEvent.x, mouseEvent.y)
})
window.addEventListener('mouseup', () => {
  mouseDown = false
})
window.addEventListener('blur', () => {
  mouseDown = false
})
canvas.addEventListener('mousemove', (mouseEvent) => {
  if (!mouseDown) {
    return
  }
  onGridClick(mouseEvent.x, mouseEvent.y)
})
