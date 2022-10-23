// TODO: get map width and height from the server

const btnReset = document.getElementById('btn-reset')
const btnFindPath = document.getElementById('btn-findpath')
const btnStarting = document.getElementById('btn-starting')
const btnDestination = document.getElementById('btn-destination')
const btnWall = document.getElementById('btn-wall')
const btnGrass = document.getElementById('btn-grass')
const btnWater = document.getElementById('btn-water')

btnReset.addEventListener('click', () => {
  // reset grid
  grid.forEach((x, y) => {
    jsonMapData.extraCost[y][x] = 0
    jsonMapData.walkable[y][x] = true
    if (['starting', 'destination'].includes(grid.data[y][x])) {
      return
    }
    grid.data[y][x] = ''
  })

  // reset path
  path.set_all(false)

  // post map data to the server
  postMapJson()
})

btnFindPath.addEventListener('click', () => {
  // post map data to the server
  postMapJson(() => {
    // get path data from the server
    getPathJson(() => {
      // reset path
      path.set_all(false)

      // apply fetched path
      if (jsonPathData.length == 0) {
        alert('There is no valid path!')
      } else {
        for (let p of jsonPathData) {
          path.data[p.y][p.x] = true
        }
      }
    })
  })
})

btnStarting.addEventListener('click', () => { paintMode = 'starting' })
btnDestination.addEventListener('click', () => { paintMode = 'destination' })
btnWall.addEventListener('click', () => { paintMode = 'wall' })
btnGrass.addEventListener('click', () => { paintMode = 'grass' })
btnWater.addEventListener('click', () => { paintMode = 'water' })
