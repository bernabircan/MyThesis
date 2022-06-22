const nodemailer = require("nodemailer");

const sendEmail = async (email, payload) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const options = () => {
      return payload
    };

    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error)
      }
      console.log(info)
    });
  } catch (error) {
    console.log(error)
    return error;
  }
};

module.exports = sendEmail;