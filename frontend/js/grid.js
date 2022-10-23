class Grid {
  constructor(
    width,
    height,
    initialValue,
    {
      tileWidth = 40,
      tileHeight = 40,
      gap = 2,
      tileColor = (x, y, tile) => {
        return '#e8e8e8'
      },
      tileText = (x, y, tile) => {
        return ''
      },
    } = {}
  ) {
    this.width = width
    this.height = height
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.gap = gap
    this.tileColor = tileColor
    this.tileText = tileText
    // init 2d array
    this.data = new Array(height)
    for (let y = 0; y < height; ++y) {
      this.data[y] = new Array(width)
      for (let x = 0; x < this.width; ++x) {
        // set initial value
        this.data[y][x] = initialValue
      }
    }
  }

  forEach(fn) {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        fn(x, y)
      }
    }
  }

  is_in_bounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height
  }
  bound_check(x, y) {
    if (!this.is_in_bounds(x, y)) {
      console.error('out of bounds')
    }
  }

  at(x, y) {
    this.bound_check(x, y)
    return this.data[y][x]
  }
  set(x, y, value) {
    this.bound_check(x, y)
    this.data[y][x] = value
  }
  set_all(value) {
    this.forEach((x, y) => {
      this.data[y][x] = value
    })
  }

  centerTopLeft() {
    return {
      x: canvas.width / 2 - (this.tileWidth * this.width) / 2,
      y: canvas.height / 2 - (this.tileHeight * this.height) / 2,
    }
  }
  canvasToGridPos(x, y) {
    const topLeft = this.gridToCanvasPos(0, 0)
    const result = { x: -1, y: -1 }
    x = x - topLeft.x
    y = y - topLeft.y
    if (x >= 0) {
      result.x = Math.floor(x / this.tileWidth)
    }
    if (y >= 0) {
      result.y = Math.floor(y / this.tileHeight)
    }
    return result
  }
  screenToGridPos(x, y) {
    const canvasPos = screenToCanvasPosition(x, y)
    return this.canvasToGridPos(canvasPos.x, canvasPos.y)
  }
  gridToCanvasPos(x, y) {
    this.bound_check(x, y)
    const center = this.centerTopLeft()
    return {
      x: center.x + x * this.tileWidth,
      y: center.y + y * this.tileHeight,
    }
  }

  draw() {
    const center = this.centerTopLeft()
    this.forEach((x, y) => {
      // draw tile
      ctx.fillStyle = this.tileColor(x, y, this.data[y][x])
      ctx.fillRect(
        center.x + x * this.tileWidth,
        center.y + y * this.tileHeight,
        this.tileWidth - this.gap,
        this.tileHeight - this.gap
      )
      // draw text
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px Arial';
      ctx.textAlign = 'center'
      ctx.fillText(
        this.tileText(x, y, this.data[y][x]),
        center.x + x * this.tileWidth + 18,
        center.y + y * this.tileHeight + 28,
      )
    })
  }
}

let grid = null
let path = null

const initPath = (width, height) => {
  path = new Grid(width, height, false, {
    gap: 4,
    tileColor: (...[, , ]) => {
      return 'rgba(0, 0, 0, 0.0)' // transparent
    },
    tileText: (...[, , tile]) => {
      switch (tile) {
        case true:
          return '🐾'
        default:
          return ''
      }
    },
  })
}

const initGrid = (width, height) => {
  grid = new Grid(width, height, '', {
    gap: 4,
    tileColor: (...[, , tile]) => {
      switch (tile) {
        case 'grass':
          return '#86d72f'
        case 'water':
          return '#00a6ed'
        default:
          return '#e8e8e8'
      }
    },
    tileText: (...[, , tile]) => {
      switch (tile) {
        case '':
          return ''
        case 'starting':
          return '🤖'
        case 'destination':
          return '🚩'
        case 'wall':
          return '🧱'
        case 'grass':
          return ''
        case 'water':
          return ''
        default:
          return '?'
      }
    },
  })
}
