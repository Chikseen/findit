module.exports = {
  sendMail(transporter, from, to, data) {
    var mailOptions = {
      from: from,
      to: to,
      subject: data.subject,
      html: data.html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return { status: "Failed" };
      } else {
        console.log("Email sent: " + info.response);
        return { status: "success" };
      }
    });
  },
};
