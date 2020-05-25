// @ts-check
function parseFitBuffer(buffer) {
  console.log('Parse fit file')
}

function parseTextBuffer(buffer) {
  const text = buffer.toString('utf8')
  console.log(text)
}

module.exports = function (ctx) {
  const buffer = ctx.file.buffer
  if (buffer.slice(8, 12).toString('ascii') === '.FIT') {
    parseFitBuffer(buffer)
  } else {
    parseTextBuffer(buffer)
  }

  ctx.body = {
    success: true,
  }
}
