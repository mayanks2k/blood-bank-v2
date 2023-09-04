const nodemailer = require('nodemailer')
const config = require('./config')

// Create a transporter using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  


module.exports = transporter;