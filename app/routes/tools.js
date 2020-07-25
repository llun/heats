// @ts-check

/**
 *
 * @param {string} name Template file name e.g. index.njk
 */
function renderPage(name) {
  return async function page(ctx) {
    await ctx.render(name)
  }
}
exports.renderPage = renderPage
