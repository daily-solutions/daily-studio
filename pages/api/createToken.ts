/*
 * This is an example server-side function that generates a meeting token
 * server-side. You could replace this on your own back-end to include
 * custom user authentication, etc.
 */

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { isOwner, roomName } = JSON.parse(req.body);

  if (req.method === 'POST') {
    console.log(`Getting token for room '${roomName}' as owner: ${isOwner}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          is_owner: isOwner,
        },
      }),
    };

    const url: string = `${
      process.env.DAILY_API_URL || 'https://api.daily.co/v1'
    }/meeting-tokens`;
    const dailyRes = await fetch(url, options);

    const { token, error } = await dailyRes.json();

    if (error) {
      return res.status(500).json({ error });
    }

    return res
      .status(200)
      .json({ token, domain: process.env.NEXT_PUBLIC_DAILY_DOMAIN });
  }

  return res.status(500);
}
