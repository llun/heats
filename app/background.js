// @ts-check
/**
 *
 * @param {import('aws-lambda').SQSEvent} event
 * @param {import('aws-lambda').Context} context
 */
async function entry(event, context) {
  for (const record of event.Records) {
    try {
      const task = JSON.parse(record.body)
      const { run } = require(`./tasks/${task.name}`)
      await run(task)
    } catch (error) {
      console.error(error.message)
    }
  }
}
exports.entry = entry
