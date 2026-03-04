import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await kv.set('cv_data', JSON.stringify(req.body));
  res.status(200).json({ ok: true });
}
