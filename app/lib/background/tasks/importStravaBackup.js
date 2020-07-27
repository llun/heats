// @ts-check
const { unzipSync } = require('zlib')
const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const { getStorage } = require('../../storage')
const { parseGPX, parseTCX, parseFIT } = require('../../parser')

/**
 *
 * @param {string} path
 * @returns {import('../../types').Parser | null}
 */
function getParser(path) {
  if (path.endsWith('gpx')) return parseGPX
  else if (path.endsWith('tcx') || path.endsWith('tcx.gz')) return parseTCX
  else if (path.endsWith('fit') || path.endsWith('fit.gz')) return parseFIT
  else return null
}

async function run() {
  const storage = await getStorage()
  try {
    const buffer = fs.readFileSync(
      path.resolve(`${__dirname}/../../../export_8734755.zip`)
    )
    const zip = await JSZip.loadAsync(buffer)
    const activities = Object.keys(zip.files).filter(
      (name) =>
        name.startsWith('activities/') &&
        (name.endsWith('.tcx.gz') ||
          name.endsWith('.gpx') ||
          name.endsWith('.fit.gz') ||
          name.endsWith('.fit'))
    )

    for (const activity of activities) {
      const parser = getParser(activity)
      if (!parser) {
        continue
      }

      const raw = await zip.files[activity].async('nodebuffer')
      const data = activity.endsWith('gz') ? unzipSync(raw) : raw
      const parsedActivities = await parser(data, path.basename(activity))
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
