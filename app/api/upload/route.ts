const fs = require('fs');

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = `public/uploads/${file.name}`;

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  return new Response(JSON.stringify({ url: `/uploads/${file.name}` }));
}
