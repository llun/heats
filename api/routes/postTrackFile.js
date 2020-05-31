// @ts-check
function parseFitBuffer(buffer) {
  console.log('Parse fit file')
}

/**
 * 
 * @param {string} filename 
 * @param {Buffer} buffer 
 */
function parseTextBuffer(filename, buffer) {  
  if (!filename.endsWith('gpx') && !filename.endsWith('tcx')) {
    throw new Error('Unsupported file')
  }
  const text = buffer.toString('utf8')
  console.log(text)
  console.log(filename)
}

module.exports = function (ctx) {
  const buffer = ctx.file.buffer
  try {
    if (buffer.slice(8, 12).toString('ascii') === '.FIT') {
      parseFitBuffer(buffer)
    } else {
      parseTextBuffer(ctx.file.originalname, buffer)
      console.log(ctx.file)
    }
  
    ctx.body = {
      success: true,
    }
  } catch (error) {
    console.log(error.message)
    ctx.body = {
      success: false,
      error: error.message
    }
  }
}
