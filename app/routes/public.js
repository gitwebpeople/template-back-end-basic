import user from '../controller/user'

module.exports = gl => {
  gl.route('/user')
    .get(user.show)
    .post(user.store)
}
