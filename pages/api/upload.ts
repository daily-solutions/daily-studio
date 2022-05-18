import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import mv from 'mv';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      const oldPath = files.file.filepath;
      const newPath = `./public/assets/${files.file.originalFilename}`;
      mv(oldPath, newPath, function (err: any) {
        console.log(err);
      });
      res.status(200).json({ ...files.file });
    });
  });
}
