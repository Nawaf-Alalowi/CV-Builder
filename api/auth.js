import crypto from 'crypto';

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};
  if (!password || hashPassword(password) !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  res.status(200).json({ ok: true });
}
