function onPaint(x, y) {
  const startingPos = jsonMapData.startingPoint
  const destinationPos = jsonMapData.destinationPoint
  switch (paintMode) {
    case 'none':
      break
    case 'starting':
      grid.set(startingPos.x, startingPos.y, new Tile())
      grid.set(x, y, new Tile('starting'))
      jsonMapData.startingPoint = { x: x, y: y }
      break
    case 'destination':
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
      jsonMapData.extra_cost[y][x] = 20
      break
    case 'water':
      grid.set(x, y, new Tile('water'))
      jsonMapData.extra_cost[y][x] = 50
      break
    default:
      console.error('unknown paint mode: ' + paintMode)
  }
}

function onErase(x, y) {
  if (['starting', 'destination'].includes(grid.data[y][x].type)) {
    return
  }
  grid.set(x, y, new Tile('none'))
  jsonMapData.extra_cost[y][x] = 0
  jsonMapData.walkable[y][x] = true
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

  if (mouseButton === 0) {
    onPaint(gridPos.x, gridPos.y)
  } else {
    onErase(gridPos.x, gridPos.y)
  }
}

let mouseDown = 0
let mouseButton = 0
window.addEventListener('mousedown', (mouseEvent) => {
  ++mouseDown
  mouseButton = mouseEvent.button
  onGridClick(mouseEvent.x, mouseEvent.y)
})
window.addEventListener('mouseup', () => {
  --mouseDown
})
window.addEventListener('blur', () => {
  mouseDown = 0
})
canvas.addEventListener('mousemove', (mouseEvent) => {
  if (!mouseDown) {
    return
  }
  onGridClick(mouseEvent.x, mouseEvent.y)
})
