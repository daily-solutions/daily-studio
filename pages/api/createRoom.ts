import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    console.log(
      `Creating room on domain ${process.env.NEXT_PUBLIC_DAILY_DOMAIN}`,
    );

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        privacy: 'public',
        properties: {
          enable_prejoin_ui: false,
          enable_people_ui: true,
          enable_network_ui: true,
          enable_screenshare: true,
          enable_chat: true,
        },
      }),
    };

    const dailyRes = await fetch(
      `${process.env.DAILY_API_URL || 'https://api.daily.co/v1'}/rooms`,
      options,
    );

    const { name, url, error } = await dailyRes.json();

    if (error) {
      return res.status(500).json({ error });
    }

    return res
      .status(200)
      .json({ name, url, domain: process.env.NEXT_PUBLIC_DAILY_DOMAIN });
  }

  return res.status(500);
}
