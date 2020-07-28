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
    await this.s3
      .putObject({
        Body: buffer,
        Bucket: this.bucket,
        Key: key
      })
      .promise()
    return key
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
