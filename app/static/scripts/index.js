// @ts-check
async function getLayers(map) {
  const response = await fetch('/layers')
  const json = await response.json()
  const { result } = json
  const { bounds } = result
  for (const item of bounds) {
    const key = item.key
    const boundary = item.boundary
    const coordinates = boundary.split(',').map(parseFloat)
    map.addSource(boundary, {
      type: 'image',
      url: `/layers/${key}`,
      coordinates: [
        [coordinates[0], coordinates[3]],
        [coordinates[2], coordinates[3]],
        [coordinates[2], coordinates[1]],
        [coordinates[0], coordinates[1]]
      ]
    })
    map.addLayer({
      id: `overlay${key}`,
      source: boundary,
      type: 'raster',
      paint: {
        'raster-opacity': 0.85
      }
    })
  }
}

window.onload = () => {
  // @ts-ignore
  mapboxgl.accessToken =
    'pk.eyJ1IjoibGx1biIsImEiOiJja2FqN2k2djIwNDU5MnlvNjR4YXRrMzFsIn0.Oir7SYHkVKBlgbPHldtRGQ'

  // @ts-ignore
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [103.8198, 1.3521],
    zoom: 11
  })
  map.on('load', () => {
    getLayers(map)
  })
}
