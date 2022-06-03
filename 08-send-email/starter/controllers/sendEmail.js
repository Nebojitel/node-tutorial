const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  let testAccaunt = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'howard.jenkins31@ethereal.email',
      pass: 'bTpayVUT8fSSVtf2wD',
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo" <foo@example.com>', // sender address
    to: 'bar@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    html: '<b>Hello world?</b>', // html body
  });

  res.json(info);
};

module.exports = sendEmail;
