export default function (req, res) {
  console.log(process.env.SERVER_MAILER_EMAIL);
  let nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.SERVER_MAILER_EMAIL,
      pass: process.env.SERVER_MAILER_PASSWORD,
    },
  });

  const mailData = {
    from: "okpeix.com",
    to: "insdb.gtaulats@gmail.com",
    subject: `Accés a okpeix-app`,
    text: req.body.message,
    html: `<div>${req.body.html}</div>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log("error: ", err);
    else console.log("info: ", info);
  });

  res.status(200).end();
}
