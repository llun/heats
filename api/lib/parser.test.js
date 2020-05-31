// @ts-nocheck
const fs = require('fs')
const test = require('ava')
const sinon = require('sinon')
const { parseGPX } = require('./parser')

test('#parseGPX returns activity with all points in activity', (t) => {
  const gpxFile = fs.readFileSync(`${__dirname}/test.gpx`)
  const activity = parseGPX(gpxFile)
  t.notThrows(() => {
    sinon.assert.match(activity, {
      startTime: 1429326906000
    })
  })
})
