async function getLayers(map) {
  const response = await fetch('/layers')
  const json = await response.json()
  const { result } = json
  for (const line of result) {
    const coordinates = line.split(',')
    const bounds = [
      [coordinates[1], coordinates[0]],
      [coordinates[3], coordinates[2]],
    ]
    L.imageOverlay(`/layers/${line}`, bounds).addTo(map)
  }
}

function loadMap(map) {
  L.tileLayer(
    'https://map.llun.dev/styles/klokantech-basic/{z}/{x}/{y}@2x.png',
    {
      attribution:
        '<a href="http://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> <a href="http://www.openstreetmap.org/about/" target="_blank">&copy; OpenStreetMap contributors</a>',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map)
}

window.onload = () => {
  const map = L.map('map').setView([1.3521, 103.8198], 12)
  loadMap(map)
  getLayers(map)
}
