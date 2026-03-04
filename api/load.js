import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const raw = await kv.get('cv_data');
  if (!raw) return res.status(404).end();
  res.status(200).json(JSON.parse(raw));
}
