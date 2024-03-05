const nodemailer = require("nodemailer");
const regMailpage = require("./RegmailPage");

async function sendMail(name, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "encore@ietlucknow.ac.in",  //encore email
      pass: process.env.ENCORE_PASSWORD,  //generated password
    },
  });

  let mailOptions = {
    from: "'Encore | IET Lucknow', encore@ietlucknow.ac.in",
    to: email,
    subject: "Welcome to the Encore",
    html: regMailpage(name),
  };

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent", info.response);
    }
  });
}

module.exports = sendMail;