// @ts-check
const fs = require('fs')
const path = require('path')

class LocalFileLoader {
  /**
   *
   * @param {string} rootDir
   */
  constructor(rootDir) {
    try {
      const stats = fs.statSync(rootDir)
      if (!stats.isDirectory()) {
        throw new Error('rootDir is not directory')
      }
      this.root = rootDir
    } catch (error) {
      console.error(error.message)
      this.root = '/tmp'
    }
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {string} filename
   */
  async save(buffer, filename) {
    const fullPath = path.join(this.root, filename)
    try {
      fs.writeFileSync(fullPath, buffer)
    } catch (error) {
      return null
    }
    return fullPath
  }

  /**
   *
   * @param {string} path
   */
  async load(path) {
    try {
      return fs.readFileSync(path)
    } catch (error) {
      console.error(error.message)
      return null
    }
  }
}
module.exports = LocalFileLoader
