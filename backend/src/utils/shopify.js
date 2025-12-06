const crypto = require('crypto');

function verifyHmac(secret, rawBody, header) {
  if (!secret) return true; // if not configured, skip (demo)
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(header));
}

module.exports = { verifyHmac };
