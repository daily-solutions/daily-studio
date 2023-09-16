export async function POST() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      privacy: 'public',
      properties: {
        enable_mesh_sfu: true,
        enable_recording: 'cloud',
        permissions: {
          hasPresence: false,
          canSend: false,
        },
      },
    }),
  };

  const dailyRes = await fetch('https://api.daily.co/v1/rooms', options);

  if (dailyRes.status >= 400) {
    const error = await dailyRes.json();
    return new Response(JSON.stringify(error), { status: dailyRes.status });
  }

  const { name, url } = await dailyRes.json();
  return new Response(
    JSON.stringify({
      name,
      url,
      domain: process.env.NEXT_PUBLIC_DAILY_DOMAIN,
    }),
    { status: 200 },
  );
}
