// @ts-check
const XMLParser = require('fast-xml-parser')

/** @type {import('./types').Parser} */
const parseGPX = (buffer) => {
  const data = XMLParser.parse(buffer.toString('utf8'), {
    attributeNamePrefix: '@',
    ignoreAttributes: false
  })
  const GPX = data.gpx
  const startTime = new Date(GPX.metadata.time).getTime()
  const tracks = Array.isArray(GPX.trk) ? GPX.trk : [GPX.trk]

  const points = tracks.reduce((points, track) => {
    const segments = Array.isArray(track.trkseg) ? track.trkseg : [track.trkseg]
    const flatten = segments.reduce(
      (points, segment) =>
        points.push(
          ...segment.trkpt.map((pt) => ({
            latitude: parseFloat(pt['@lat']),
            longitude: parseFloat(pt['@lon']),
            altitude: pt.ele,
            timestamp: new Date(pt.time).getTime()
          }))
        ) && points,
      []
    )
    return points.push(...flatten) && points
  }, [])

  return {
    startTime,
    points
  }
}
exports.parseGPX = parseGPX
