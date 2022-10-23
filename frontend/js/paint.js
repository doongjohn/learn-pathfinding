function onErase(x, y) {
  grid.set(x, y, '')
  jsonMapData.extraCost[y][x] = 0
  jsonMapData.walkable[y][x] = true
}

function onPaint(x, y) {
  if (paintMode === '') {
    return
  }

  // remove existing tile
  onErase(x, y)

  // paint new tile
  switch (paintMode) {
    case 'starting':
      const startingPos = jsonMapData.startingPoint
      onErase(startingPos.x, startingPos.y)
      grid.set(x, y, 'starting')
      jsonMapData.startingPoint = { x: x, y: y }
      break

    case 'destination':
      const destinationPos = jsonMapData.destinationPoint
      onErase(destinationPos.x, destinationPos.y)
      grid.set(x, y, 'destination')
      jsonMapData.destinationPoint = { x: x, y: y }
      break

    case 'wall':
      grid.set(x, y, 'wall')
      jsonMapData.walkable[y][x] = false
      break

    case 'grass':
      grid.set(x, y, 'grass')
      jsonMapData.extraCost[y][x] = 20
      break

    case 'water':
      grid.set(x, y, 'water')
      jsonMapData.extraCost[y][x] = 50
      break

    default:
      console.error('unknown paint mode: ' + paintMode)
  }
}

function onGridClick(mouseX, mouseY) {
  const gridPos = grid.screenToGridPos(mouseX, mouseY)

  // check bounds
  if (!grid.is_in_bounds(gridPos.x, gridPos.y)) {
    return
  }

  // reset path
  path.set_all(false)

  if (['starting', 'destination'].includes(grid.data[gridPos.y][gridPos.x])) {
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

window.addEventListener('blur', () => {
  mouseDown = false
})

window.addEventListener('mouseup', () => {
  mouseDown = false
})

window.addEventListener('mousedown', (mouseEvent) => {
  mouseDown = true
  mouseButton = mouseEvent.button
  onGridClick(mouseEvent.x, mouseEvent.y)
})

canvas.addEventListener('mousemove', (mouseEvent) => {
  if (!mouseDown) {
    return
  }
  onGridClick(mouseEvent.x, mouseEvent.y)
})
