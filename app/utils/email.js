import nodemailer from 'nodemailer'

export default class {
  constructor (emailTo) {
    this.emailTo = emailTo
    this.configs = {
      SMTP: process.env.EMAIL_SMTP,
      PORT: process.env.EMAIL_PORT,
      USER: process.env.EMAIL_USER,
      PASS: process.env.EMAIL_PASS
    }
  }

  async sendMail (data) {
    const transporter = nodemailer.createTransport({
      host: this.configs.SMTP,
      port: this.configs.PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configs.USER, // generated ethereal user
        pass: this.configs.PASS // generated ethereal password
      }
    })

    return new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `"Sauce Web" <${this.configs.USER}>`, // sender address
        to: this.emailTo, // list of receivers
        subject: 'Forgot your password', // Subject line
        html: data.html
      },
      function (err, info) {
        if (err) return reject(err)
        resolve(info)
      })
    })
  }
}
