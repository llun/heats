// @ts-check
/**
 *
 * @param {import('aws-lambda').SQSEvent} event
 * @param {import('aws-lambda').Context} context
 */
async function entry(event, context) {
  console.log(event, context)
}
exports.entry = entry
