import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token || token !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await kv.set('cv_data', req.body);
  res.status(200).json({ ok: true });
}
