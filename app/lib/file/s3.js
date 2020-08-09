// @ts-check
const AWS = require('aws-sdk')

class S3FileLoader {
  /**
   *
   * @param {string} bucket
   */
  constructor(bucket) {
    this.s3 = new AWS.S3()
    this.bucket = bucket
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {string} filename
   */
  async save(buffer, filename) {
    const key = `upload/${filename}`
    try {
      await this.s3
        .putObject({
          Body: buffer,
          Bucket: this.bucket,
          Key: key
        })
        .promise()
      return key
    } catch (error) {
      console.error(JSON.stringify({ bucket: this.bucket, key }))
      console.error(error.message)
      console.error(new Error().stack)
      return null
    }
  }

  /**
   *
   * @param {string} path
   */
  async load(path) {
    const item = await this.s3
      .getObject({
        Bucket: this.bucket,
        Key: path
      })
      .promise()
    return item.Body
  }
}
module.exports = S3FileLoader
