const nodemailer = require('nodemailer');

module.exports = async options => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'a49c7354a425c6',
      pass: '33aec33e2f6e07'
    }
  });

  const mailOptions = {
    from: 'Marius Vasili <mariusvasili24@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  await transporter.sendMail(mailOptions);
};
