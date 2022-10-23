// TODO: get map width and height from the server

const btnReset = document.getElementById('btn-reset')
const btnFindPath = document.getElementById('btn-findpath')
const btnStarting = document.getElementById('btn-starting')
const btnDestination = document.getElementById('btn-destination')
const btnWall = document.getElementById('btn-wall')
const btnGrass = document.getElementById('btn-grass')
const btnWater = document.getElementById('btn-water')

btnReset.addEventListener('click', () => {
  for (let y = 0; y < 10; ++y) {
    for (let x = 0; x < 10; ++x) {
      jsonMapData.extra_cost[y][x] = 0
      jsonMapData.walkable[y][x] = true
      grid.forEach((x, y) => {
        if (['starting', 'destination'].includes(grid.data[y][x].type)) {
          return
        }
        grid.data[y][x] = new Tile()
      })
    }
  }
  path.forEach((x, y) => {
    path.data[y][x] = false
  })
  postMapJson()
})

btnFindPath.addEventListener('click', () => {
  postMapJson(() => {
    getPathJson(() => {
      // reset all
      path.forEach((x, y) => {
        path.data[y][x] = false
      })
      // set fetched data
      for (let p of jsonPathData) {
        path.data[p.y][p.x] = true
      }
    })
  })
})

btnStarting.addEventListener('click', () => {
  paintMode = 'starting'
})

btnDestination.addEventListener('click', () => {
  paintMode = 'destination'
})

btnWall.addEventListener('click', () => {
  paintMode = 'wall'
})

btnGrass.addEventListener('click', () => {
  paintMode = 'grass'
})

btnWater.addEventListener('click', () => {
  paintMode = 'water'
})
