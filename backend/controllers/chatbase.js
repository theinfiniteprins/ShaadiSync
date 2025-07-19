
const crypto = require('crypto');

const CHATBASE_SECRET = process.env.CHATBASE_SECRET; // Store your secret in env

exports.getChatbaseHash = (req, res) => {
  const userId = req.user.id; // or however you identify your user
  const hash = crypto.createHmac('sha256', CHATBASE_SECRET).update(userId).digest('hex');
  res.json({ userId, hash });
};