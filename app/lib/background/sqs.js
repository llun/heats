// @ts-check
const AWS = require('aws-sdk')

class SQSBackgroundRunner {
  /**
   *
   * @param {string} url
   */
  constructor(url) {
    this.sqs = new AWS.SQS()
    this.url = url
  }

  /**
   *
   * @param {import('./index').Task} task
   */
  async runTask(task) {
    await this.sqs
      .sendMessage({
        MessageBody: JSON.stringify(task),
        QueueUrl: this.url
      })
      .promise()
  }
}

module.exports = SQSBackgroundRunner
