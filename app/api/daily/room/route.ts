const generateRandomRoomName = () => {
  const PREFIX = 'vs-';
  const RANDOM_STRING_LENGTH = 39;

  const randomString = Array.from({ length: RANDOM_STRING_LENGTH })
    .map(() => Math.random().toString(36)[2])
    .join('');

  return PREFIX + randomString;
};

export async function POST() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: generateRandomRoomName(),
      privacy: 'public',
      properties: {
        enable_recording: 'cloud',
      },
    }),
  };

  const dailyRes = await fetch('https://api.daily.co/v1/rooms', options);
  const { name, url, error } = await dailyRes.json();
  if (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      name,
      url,
      domain: process.env.NEXT_PUBLIC_DAILY_DOMAIN,
    }),
    { status: 200 }
  );
}
