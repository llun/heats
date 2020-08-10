// @ts-check
const fs = require('fs')
const path = require('path')
const { file } = require('jszip')

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
   * @param {import('./index').FileType} type
   * @param {string} filename
   */
  async save(buffer, type, filename) {
    const fullPath = path.join(this.root, `${type}-${filename}`)
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
