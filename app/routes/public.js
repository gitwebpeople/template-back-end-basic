import user from '../controller/user'
import password from '../controller/password'
import meme from '../controller/meme'
import page from '../controller/page'
import post from '../controller/post'
import variation from '../controller/variation'
import search from '../controller/search'
import globalMessage from '../controller/globalMessage'
import chart from '../controller/chart'
import categories from '../controller/categories'
import adminBlock from '../controller/admin/block'

module.exports = gl => {
  gl.route('/user')
    .get(user.show)
    .post(user.store)

  gl.route('/meme').get(meme.index)
  gl.route('/meme/:id').get(meme.show)

  gl.route('/variation').get(variation.index)
  gl.route('/variation/:meme/meme').get(variation.index)
  gl.route('/variation/:id').get(variation.show)

  gl.route('/page').get(page.index)
  gl.route('/page/:id').get(page.show)

  gl.route('/post/:page/page').get(post.index)
  gl.route('/post/:id').get(post.show)

  gl.route('/search').get(search.index)

  gl.route('/global/message/last').get(globalMessage.show)

  gl.route('/chart/:item/:model').get(chart.show)

  gl.route('/categories').get(categories.index)
  gl.route('/categories/insert/seed/cats').get(categories.store)

  gl.route('/admin/block/:id').get(adminBlock.show)
  gl.route('/password/forgot').post(password.store)
  gl.route('/password/change').post(password.update)
}
