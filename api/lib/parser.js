// @ts-check
const XMLParser = require('fast-xml-parser')

/**
 * @type {import('./types').Parser}
 * */
const parseGPX = (buffer, filename) => {
  const data = XMLParser.parse(buffer.toString('utf8'), {
    attributeNamePrefix: '@',
    ignoreAttributes: false
  })
  const GPX = data.gpx
  const createdWith = GPX['@creator']
  const startedAt = new Date(GPX.metadata.time).getTime()
  const tracks = Array.isArray(GPX.trk) ? GPX.trk : [GPX.trk]
  const name = tracks[0].name

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

  return [
    {
      name,
      file: filename,
      createdWith,
      startedAt,
      points
    }
  ]
}
exports.parseGPX = parseGPX

/**
 * @type {import('./types').Parser}
 */
const parseTCX = (buffer, filename) => {
  const data = XMLParser.parse(buffer.toString('utf8'), {
    attributeNamePrefix: '@',
    ignoreAttributes: false
  })
  const activities = Array.isArray(data.TrainingCenterDatabase.Activities)
    ? data.TrainingCenterDatabase.Activities
    : [data.TrainingCenterDatabase.Activities.Activity]

  const result = []
  for (const activity of activities) {
    const createdWith = activity.Creator && activity.Creator.Name
    const startedAt = new Date(
      activity.Lap && activity.Lap['@StartTime']
    ).getTime()
    const name = `${activity['@Sport']}-${activity.Id}`
    const tracks = Array.isArray(activity.Lap.Track)
      ? activity.Lap.Track
      : [activity.Lap.Track]
    /** @type {import('./types').Point[]} */
    const points = tracks.reduce((out, track) => {
      const points = track.Trackpoint.map((point) => {
        return {
          latitude: point.Position.LatitudeDegrees,
          longitude: point.Position.LongitudeDegrees,
          altitude: point.AltitudeMeters,
          timestamp: new Date(point.Time).getTime()
        }
      })
      return out.push(...points) && out
    }, [])
    result.push({
      name,
      file: filename,
      createdWith,
      startedAt,
      points
    })
  }
  return result
}
exports.parseTCX = parseTCX
