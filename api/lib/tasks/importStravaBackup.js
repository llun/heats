// @ts-check
const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const SQLStorage = require('../storage/sql')
const { parseGPX } = require('../parser')

async function run() {
  const storage = new SQLStorage()
  try {
    const buffer = fs.readFileSync(
      path.join(`${__dirname}/../../export_8734755.zip`)
    )
    const zip = await JSZip.loadAsync(buffer)
    await Promise.all(
      Object.keys(zip.files)
        .filter(
          (name) => name.endsWith('gpx') && name.startsWith('activities/')
        )
        .map(async (path) => {
          const gpx = await zip.file(path).async('nodebuffer')
          const activity = parseGPX(gpx, path)
          await storage.addActivity(1, activity)
          console.log(`Added ${path}`)
        })
    )
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
