const nodemailer = require('nodemailer')

exports.routesConfig = function (app) {
    app.post('/contact', (req, res) => {
        console.log('contact endpoint hit')
        // Instantiate the SMTP server
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
          from: 'Your sender info here', // This is ignored by Gmail
          to: `wforte6.burkedeveloping@gmail.com`,
          subject: 'Burke Developing Form Submission',
          text: `
                Customer Name: ${req.body.name} 
                Customer Email: (${req.body.email}) 
                Customer Response: ${req.body.message}
                Cell Phone: ${req.body.cellphone}`
        }
      
        // Attempt to send the email
        smtpTrans.sendMail(mailOpts, (error, response) => {
          if (error) {
            res.status(403).send()// Show a page indicating failure
          }
          else {
            console.log(response)
            res.status(200).send() // Show a page indicating success
          }
        })
      })
}