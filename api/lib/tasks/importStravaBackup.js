// @ts-check
const { unzipSync } = require('zlib')
const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const SQLStorage = require('../storage/sql')
const { parseGPX, parseTCX } = require('../parser')

/**
 *
 * @param {string} path
 * @returns {import('../types').Parser | null}
 */
function getParser(path) {
  if (path.endsWith('gpx')) return parseGPX
  else if (path.endsWith('tcx') || path.endsWith('tcx.gz')) return parseTCX
  else return null
}

async function run() {
  const storage = new SQLStorage()
  try {
    const buffer = fs.readFileSync(
      path.resolve(`${__dirname}/../../export_8734755.zip`)
    )
    const zip = await JSZip.loadAsync(buffer)
    const activities = Object.keys(zip.files).filter(
      (name) =>
        name.startsWith('activities/') &&
        (name.endsWith('.tcx.gz') || name.endsWith('.gpx'))
    )
    for (const activity of activities) {
      const parser = getParser(activity)
      if (!parser) {
        continue
      }

      const raw = await zip.files[activity].async('nodebuffer')
      const data = activity.endsWith('gz') ? unzipSync(raw) : raw
      const parsedActivities = parser(data, path.basename(activity))
      for (const parsedActivity of parsedActivities) {
        await storage.addActivity(1, parsedActivity)
        console.log(`Added ${activity}`)
      }
    }
  } finally {
    await storage.close()
  }
}

run()
  .then(() => {
    console.log('Done')
  })
  .catch((error) => {
    console.error(error.message)
    console.error(error.stack)
  })
