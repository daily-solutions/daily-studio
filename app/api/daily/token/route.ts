export async function POST(request: Request) {
  const { roomName, isOwner } = await request.json();

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
        permissions: {
          canSend: true,
          hasPresence: true,
        },
      },
    }),
  };

  const dailyRes = await fetch(
    'https://api.daily.co/v1/meeting-tokens',
    options,
  );
  const { token, error } = await dailyRes.json();
  if (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}
