export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomName = searchParams.get('roomName');

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
  };

  const dailyRes = await fetch(
    `https://api.daily.co/v1/rooms/${roomName}/presence`,
    options,
  );
  const { data: participants } = await dailyRes.json();

  return new Response(JSON.stringify({ participants }), { status: 200 });
}
