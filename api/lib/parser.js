// @ts-check
const _ = require('lodash')
const XMLParser = require('fast-xml-parser')
const FitParser = require('fit-file-parser').default

/**
 * @type {import('./types').Parser}
 * */
const parseGPX = async (buffer, filename) => {
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
const parseTCX = async (buffer, filename) => {
  const data = XMLParser.parse(buffer.toString('utf8'), {
    attributeNamePrefix: '@',
    ignoreAttributes: false
  })

  const activities = Array.isArray(data.TrainingCenterDatabase.Activities)
    ? data.TrainingCenterDatabase.Activities
    : [data.TrainingCenterDatabase.Activities.Activity]

  /** @type {import('./types').Activity[]} */
  const result = []
  for (const activity of activities) {
    const createdWith = (activity.Creator && activity.Creator.Name) || 'Unknown'
    const laps = Array.isArray(activity.Lap) ? activity.Lap : [activity.Lap]
    const startedAt = new Date(laps[0] && laps[0]['@StartTime']).getTime()
    const name = `${activity['@Sport']}-${activity.Id}`
    /** @type {import('./types').Point[]} */
    const points = []
    for (const lap of laps) {
      const tracks = Array.isArray(lap.Track) ? lap.Track : [lap.Track]
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
      points.push(...points)
    }
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

/**
 * @type {import('./types').Parser}
 */
const parseFIT = async (buffer, filename) => {
  const parser = new FitParser({
    force: true,
    speedUnit: 'km/h',
    lengthUnit: 'km',
    elapsedRecordField: true,
    mode: 'cascade'
  })

  const parsedData = await new Promise((resolve, reject) => {
    parser.parse(buffer, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })

  const fileId = parsedData.file_id
  const createdWith = (fileId && fileId.manufacturer) || 'Unknown'
  const startedAt = new Date(fileId && fileId.time_created).getTime()
  const name = `${createdWith}-${new Date(fileId.time_created).toISOString()}`

  const activity = parsedData.activity
  const sessions = activity.sessions
  const points = _.flattenDeep(
    sessions.map((session) =>
      session.laps.map((lap) =>
        lap.records.map((record) => ({
          latitude: record.position_lat,
          longitude: record.position_long,
          altitude: record.altitude,
          timestamp: new Date(record.timestamp).getTime()
        }))
      )
    )
  ).filter((point) => point.latitude && point.longitude)
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
exports.parseFIT = parseFIT
