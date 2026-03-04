import crypto from 'crypto';
import { put, del, list } from '@vercel/blob';

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token || hashPassword(token) !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    // Delete existing blob first
    const { blobs } = await list({ prefix: 'cv_data.json' });
    if (blobs.length) {
      await del(blobs.map(b => b.url));
    }
    // Write new blob
    await put('cv_data.json', JSON.stringify(req.body), {
      access: 'public',
      addRandomSuffix: false,
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
