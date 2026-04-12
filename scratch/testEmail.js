const dotenv = require('dotenv');
const sendEmail = require('./backend/utils/sendEmail');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const runTest = async () => {
  console.log('Testing email send with:');
  console.log('User:', process.env.EMAIL_USER);
  console.log('Service:', process.env.EMAIL_SERVICE);
  
  try {
    await sendEmail({
      email: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email from Eventify',
      message: 'If you receive this, the email system is working.',
      html: '<h1>Success!</h1><p>The email system is working.</p>'
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

runTest();
