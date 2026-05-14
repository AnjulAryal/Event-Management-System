const nodemailer = require('nodemailer');

// Create transporter ONCE and reuse it (avoids repeated SSL handshakes)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true, // Use connection pooling for multiple emails
  maxConnections: 3,
  maxMessages: 50,
});

// Verify connection on startup (logs error if credentials are wrong)
transporter.verify()
  .then(() => console.log('Email transporter ready'))
  .catch((err) => console.error('Email transporter error:', err.message));

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Eventify" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
