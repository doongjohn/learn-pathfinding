const canvasContainer = document.getElementById('canvas-container')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

window.addEventListener('resize', () => {
  canvas.width = canvasContainer.offsetWidth
  canvas.height = canvasContainer.offsetHeight
})

// canvas.style.background = 'black'
canvas.width = canvasContainer.offsetWidth
canvas.height = canvasContainer.offsetHeight

function screenToCanvasPosition(x, y) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: x - rect.left,
    y: y - rect.top,
  }
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response;
}

async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  return response;
}

let jsonMapData = null
let jsonPathData = null
let paintMode = ''

function getMapJson(callback) {
  getData('/get_map_json')
    .then((response) => response.json())
    .then(json => {
      jsonMapData = json
      callback && callback()
    }).catch(function (e) {
      console.error(e)
      console.error('get_map_json failed')
    })
}

function postMapJson(callback) {
  postData('/set_map_json', jsonMapData)
    .then(() => {
      callback && callback()
    }).catch(function (e) {
      console.error(e)
      console.error('set_map_json failed')
    })
}

function getPathJson(callback) {
  getData('/get_path_json')
    .then((response) => response.json())
    .then(json => {
      // remove first and last element
      json.shift()
      json.pop()
      jsonPathData = json
      callback && callback()
    }).catch(function (e) {
      console.error(e)
      console.error('get_path_json failed')
    })
}

// get initial map data
getData('/get_map_json')
  .then((response) => response.json())
  .then(json => {
    jsonMapData = json
  }).catch(function (e) {
    console.error(e)
    console.error('get_map_json failed')
    alert('Failed to load initial map data!\nPlease check the server status and reload the page.')
  })
