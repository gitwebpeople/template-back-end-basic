import user from '../controller/user'
import { authenticate } from '../middleware/passport'
import token from '../middleware/token'

module.exports = gl => {
  gl.route('/user').put(authenticate, user.update)
}
