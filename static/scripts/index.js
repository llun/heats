// @ts-check
async function getLayers(map) {
  const response = await fetch('/layers')
  const json = await response.json()
  const { result } = json
  for (const line of result) {
    const coordinates = line.split(',').map(parseFloat)
    map.addSource(line, {
      type: 'image',
      url: `/layers/${line}`,
      coordinates: [
        [coordinates[0], coordinates[3]],
        [coordinates[2], coordinates[3]],
        [coordinates[2], coordinates[1]],
        [coordinates[0], coordinates[1]],
      ],
    })
    map.addLayer({
      id: `overlay${line}`,
      source: line,
      type: 'raster',
      paint: {
        'raster-opacity': 0.85,
      },
    })
  }
}

window.onload = () => {
  // @ts-ignore
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://map.llun.dev/styles/klokantech-basic/style.json',
    center: [103.8198, 1.3521],
    zoom: 11,
  })
  map.on('load', () => {
    getLayers(map)
  })
}
