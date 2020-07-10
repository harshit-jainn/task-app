const mailer = require('@sendgrid/mail');
const api_key = process.env.SENDGRID_API_KEY;
mailer.setApiKey(api_key);
module.exports = mailer;
