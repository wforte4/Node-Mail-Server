const nodemailer = require('nodemailer')

exports.sendNewEmail = async (email, subject, html) => {
    
    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "wforte6.burkedeveloping@gmail.com",
          pass: "S3x2433!"
        }
      })

    
      // Specify what the email will look like
      const mailOpts = {
        to: email,
        subject: subject,
        html: html
      }
    
      // Attempt to send the email
      await smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
          return error
        }
        else {
          console.log(response)
          return response
        }
      })
}