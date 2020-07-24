// @ts-check

async function loginPage(ctx) {
  await ctx.render('index.njk')
}

async function uploadPage(ctx) {
  await ctx.render('upload.njk')
}

/**
 *
 * @param {import('koa-router')} router
 */
exports.indexRoutes = (router) => {
  router.get('/', loginPage)
  router.get('/upload', uploadPage)
}
