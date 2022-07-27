const nodemailerSendgrid = require('nodemailer-sendgrid');
const nodemailer = require('nodemailer');
const pug = require('pug');
const catchAsync = require('./catchAsync');
// import { htmlToText } from 'html-to-text';
const { htmlToText } = require('html-to-text');

// new Email( user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV.startsWith('p')) {
      // sendinBlue
      return nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: '587', // here your port may vary!
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD
        }
      });
    }
  }

  // newTransport() {
  //   if (process.env.NODE_ENV === 'development') {
  //     return nodemailer.createTransport(
  //       nodemailerSendgrid({
  //         apiKey: process.env.SENDGRID_PASSWORD
  //       })
  //     );

  //     // return nodemailer.createTransport({
  //     //   host: process.env.EMAIL_HOST,
  //     //   port: process.env.EMAIL_PORT,
  //     //   auth: {
  //     //     user: process.env.EMAIL_USERNAME,
  //     //     pass: process.env.EMAIL_PASSWORD
  //     //   }
  //     // });
  //   }

  //   // SendGrid
  //   // return nodemailer.createTransport(
  //   //   nodemailerSendgrid({
  //   //     apiKey: process.env.SENDGRID_PASSWORD
  //   //   })
  //   // );

  //   console.log(process.env.NODE_ENV);
  //   //   return nodemailer.createTransport({
  //   //     service: 'SendGrid',
  //   //     auth: {
  //   //       user: process.env.SENDGRID_USERNAME,
  //   //       pass: process.env.SENDGRID_PASSWORD
  //   //     }
  //   //   });
  // }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    // 2) Define Email options
    // console.log(html);
    const text = htmlToText(html, {
      wordwrap: 130
    });
    // const text = htmlToText.fromString(html);
    // console.log(text);
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: text
    };

    // 3) Create a transport and send Emails

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

// OLD WAY OF SENDING EMAILS

// const sendEmail = catchAsync(async options => {
//   // 1) Create a transporter
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST,
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD
//   //   }
//   // });

//   // 2) Define the Email options
//   // const mailOptions = {
//   //   from: 'Tasawar Abbas <taswar@gmail.com>',
//   //   to: options.email,
//   //   subject: options.subject,
//   //   text: options.message
//   //   // html:
//   // };
//   // 3) Actually send the email
//   // await transporter.sendMail(mailOptions);
// });
