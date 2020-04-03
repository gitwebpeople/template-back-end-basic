import user from '../controller/user'
import password from '../controller/password'
import meme from '../controller/meme'
import page from '../controller/page'
import post from '../controller/post'
import variation from '../controller/variation'
import globalMessage from '../controller/globalMessage'
import vote from '../controller/vote'
import comment from '../controller/comment'
import view from '../controller/view'
import report from '../controller/report'
import rip from '../controller/rip'
import follow from '../controller/follow'
import nickname from '../controller/nickname'
import adminBlock from '../controller/admin/block'
import { authenticate } from '../middleware/passport'
import { checkPagePermissions } from '../middleware/adminActions'
import token from '../middleware/token'

module.exports = gl => {
  gl.route('/user').put(authenticate, user.update)

  gl.route('/meme').post(authenticate, meme.store)
  gl.route('/meme/:id').delete(authenticate, meme.delete)

  gl.route('/variation').post(authenticate, variation.store)
  gl.route('/variation/:id').delete(authenticate, variation.delete)

  gl.route('/page').post(authenticate, page.store)
  gl.route('/page/:id')
    .put(authenticate, checkPagePermissions, page.update)
    .delete(authenticate, page.delete)

  gl.route('/post').post(authenticate, post.store)
  gl.route('/post/:id')
    .delete(authenticate, post.delete)
    .put(authenticate, post.update)

  gl.route('/global/message')
    .post(authenticate, globalMessage.store)
    .get(authenticate, globalMessage.index)

  gl.route('/vote').post(authenticate, vote.store)

  gl.route('/comment')
    .post(authenticate, comment.store)
    .put(authenticate, comment.update)

  gl.route('/comment/:item/:model/:commentId').delete(
    authenticate,
    comment.delete
  )

  gl.route('/view').post(authenticate, view.store)

  gl.route('/report').post(authenticate, report.store)

  gl.route('/rip/:meme').put(authenticate, rip.store)

  gl.route('/follow').post(authenticate, follow.store)

  gl.route('/nickname').get(authenticate, nickname.show)

  gl.route('/token').get(authenticate, token.show)

  gl.route('/admin/block')
    .put(authenticate, adminBlock.update)
    .get(authenticate, adminBlock.index)
}
