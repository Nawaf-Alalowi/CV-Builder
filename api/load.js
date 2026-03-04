import crypto from 'crypto';
import { list, getDownloadUrl } from '@vercel/blob';

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token || hashPassword(token) !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { blobs } = await list({ prefix: 'cv_data.json' });
    if (!blobs.length) return res.status(404).end();
    const response = await fetch(blobs[0].url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
