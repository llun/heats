// @ts-check
class LocalBackground {
  /**
   *
   * @param {import('./index').Task} task
   */
  async runTask(task) {
    const { run } = require(`./tasks/${task.name}`)
    await run(task)
  }
}
module.exports = LocalBackground
