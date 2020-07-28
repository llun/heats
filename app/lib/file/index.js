// @ts-check
const LocalFileLoader = require('./local')
const S3FileLoader = require('./s3')

let _instance = null

/**
 * @returns {import('./index').FileLoader}
 */
exports.getFileLoader = () => {
  if (!_instance) {
    _instance = new LocalFileLoader(process.env.UPLOAD_DIR || '/tmp')
    if (process.env.S3_BUCKET) {
      _instance = new S3FileLoader(process.env.S3_BUCKET)
    }
  }
  return _instance
}
