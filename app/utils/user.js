import ModelUser from '../database/mongo/models/user'
import jwt from 'jwt-simple'
import bcrypt from 'bcrypt'
import moment from 'moment'

module.exports = class Login {
  constructor (login, pass, userData) {
    this.login = login
    this.pass = pass
    this.userData = userData
  }

  async verifyNickName (nickname) {
    const haveNickName = await ModelUser.findOne({ nickname })
    if (haveNickName) return true
    return false
  }

  getUserPayload (token) {
    try {
      const user = token
        ? jwt.decode(token.replace('bearer ', ''), process.env.SECRET)
        : {}
      return user
    } catch (e) {
      return {}
    }
  }

  async disblockUsers () {
    const users = await ModelUser.find({ 'blocked.activated': true })
    if (users.length <= 0) return
    users.forEach(async user => {
      const expirationDate = moment(user.blocked.expirationDate)
      const today = moment()
      console.log(expirationDate.isSame(today, 'day'))
      if (expirationDate.isSame(today, 'day')) {
        const userDb = await ModelUser.findById(user._id)
        userDb.blocked.activated = false
        await userDb.save()
      }
    })
  }

  async normalLogin () {
    try {
      if (!this.login) throw { status: 400, msg: 'login not sended' }
      if (!this.pass) throw { status: 400, msg: 'Password not sended' }
      const user = await ModelUser.findOne({
        $or: [{ email: this.login }, { nickname: this.login }]
      })
      if (!user) throw { status: 400, msg: 'User not found' }
      const passResult = await bcrypt.compare(this.pass, user.password)
      if (!passResult) return { status: 400, msg: 'Incorrect Password' }

      const now = Math.floor(Date.now() / 1000)

      const payload = user.memegod ? {
        id: user._id,
        name: user.name,
        email: user.email,
        memegod: user.memegod,
        media: user.media,
        blocked: user.blocked,
        nick: user.nickname,
        iat: now,
        exp: now + 60 * 60 * 24 * 365
      }
        : {
          id: user._id,
          name: user.name,
          email: user.email,
          media: user.media,
          blocked: user.blocked,
          nick: user.nickname,
          iat: now,
          exp: now + 60 * 60 * 24 * 365
        }
      return {
        status: 200,
        payload,
        token: jwt.encode(payload, process.env.SECRET)
      }
    } catch (e) {
      return e
    }
  }

  async facebookLogin () {
    const user = await ModelUser.findOne({
      $or: [{ email: this.login }, { nickname: this.login }]
    })
    let newUser = null
    if (!user) {
      newUser = await ModelUser.create({
        email: this.login,
        name: this.userData.name,
        media: {
          url: this.userData.foto,
          type: 'image'
        },
        password: 'facebook',
        nickname: this.login + this.userData.name
      })
    } else {
      newUser = user
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = newUser.memegod ? {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      memegod: newUser.memegod,
      media: newUser.media,
      nick:
        newUser.nickname !== this.login + this.userData.name
          ? newUser.nickname
          : false,
      iat: now,
      exp: now + 60 * 60 * 24 * 365
      // exp: now + 1
    }
      : {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        media: newUser.media,
        nick:
          newUser.nickname !== this.login + this.userData.name
            ? newUser.nickname
            : false,
        iat: now,
        exp: now + 60 * 60 * 24 * 365
        // exp: now + 1
      }
    return {
      status: 200,
      payload,
      token: jwt.encode(payload, process.env.SECRET)
    }
  }
}
