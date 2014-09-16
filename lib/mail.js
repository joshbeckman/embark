var postmark = require("postmark")(process.env.POSTMARK_API_KEY)
  , jade = require('jade')
  , confirm = jade.compileFile('./views/mail/confirm.jade', null)
  , confirmOpt = {
    title: null,
    bodyElements: [],
    link: null,
    linkCTA: null,
    linkColor: '#348eda',
    byline: null,
    footerText: null,
    footerLink: null,
    footerLinkText: null
  }
  , alert = jade.compileFile('./views/mail/alert.jade', null)
  , alertOpt = {
    title: null,
    alert: null,
    alertColor: '#ff9f00',
    bodyElements: [],
    link: null,
    linkCTA: null,
    linkColor: '#348eda',
    byline: null,
    footerText: null,
    footerLink: null,
    footerLinkText: null
  }
  , billing = jade.compileFile('./views/mail/billing.jade', null)
  , types = {
    billing: billing,
    alert: alert,
    confirm: confirm
  };

function mail (data, cb) {
  postmark.send({
    "From": data.from,
    "To": data.to,
    "Subject": data.subject,
    "HtmlBody": types[data.type](data.locals),
    "Tag": data.tag
  }, function(error, success) {
    if(error) {
      console.error("Unable to send via postmark: " + error.message);
      cb(error, false);
    }
    cb(null, true);
  });
}

module.exports = mail;