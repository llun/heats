// @ts-check
const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const SQLStorage = require('../storage/sql')
const { parseGPX, parseTCX } = require('../parser')

function getParser(path) {
  if (path.endsWith('gpx')) return parseGPX
  else if (path.endsWith('tcx')) return parseTCX
  else return null
}

async function run() {
  const storage = new SQLStorage()
  try {
    const buffer = fs.readFileSync(
      path.resolve(`${__dirname}/../../export_8734755.zip`)
    )
    const zip = await JSZip.loadAsync(buffer)
    console.log(
      Object.keys(zip.files).filter(
        (name) => name.startsWith('activities/') && !name.endsWith('/')
      )
    )
    // const x = zip.file(zip.files[0]).async('nodebuffer')
    // const parser = getParser(zip.files[0])
    // console.log(parser)

    // await Promise.all(
    //   Object.keys(zip.files)
    //     .filter((name) => name.startsWith('activities/'))
    //     .map(async (path) => {
    //       const buffer = await zip.file(path).async('nodebuffer')
    //       const parser = getParser(path)
    //       if (!parser) return

    //       const activities = parser(buffer, path)
    //       for (const activity of activities) {
    //         await storage.addActivity(1, activity)
    //       }
    //       console.log(`Added ${path}`)
    //     })
    // )
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
