require("dotenv").config();
module.exports = {
  initmail() {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>The authservice for drunc.net just started</h1>
        <p>see the currrent status @...</p>
        <a href="${process.env.NODE_ENV == "development" ? "http://localhost:8080" : "drunc.net"}">checkSite</a>
      </body>
    </html>`;
  },
  valimail(id) {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>Please validate your E-Mail address to use the drunc service</h1>
        <p>just click this Button and the magic Wizard will validate your account</p>
        <a href="${process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'drunc.net'}/varifyer?verificationID=${id}">Validate me</a>
        <p>Your mailer dosent support HTML ??? try copy this link in the browsers searchbar</p>
        <p>${process.env.NODE_ENV == 'development' ? 'http://localhost:8080' : 'drunc.net'}/varifyer?verificationID=${id}</p>
        </body>
    </html>
    `;
  },
  projinvite() {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>Someone has invited you to his project</h1>
        <p>checkout your account to see stuff</p>
        <a href="${process.env.NODE_ENV == "development" ? "http://localhost:8080" : "drunc.net"}/home">go To your account</a>
      </body>
    </html>
    `;
  },
};
