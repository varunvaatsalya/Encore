const nodemailer = require("nodemailer");

async function sendMail(name, email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",  //encore email
      pass: "",  //generated password
    },
  });

  let mailOptions = {
    from: "'Encore | IET Lucknow', varunvaatsalya@gmail.com",
    to: email,
    subject: "Welcome to the Encore",
    text: `hii ${name},
              greeting from Encore, IET Lucknow!
              congratulations, you have sucessfully registered for the Encore`,
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