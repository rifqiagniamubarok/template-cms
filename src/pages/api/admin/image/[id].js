import fs from 'fs';
import path from 'path';
import { Prisma } from '../../../../libs/Prisma';

// Disable Next.js bodyParser, since formidable will handle the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

function handler(req, res, session) {
  switch (req.method) {
    case 'DELETE':
      handleDelete(req, res, session);
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

const handleDelete = async (req, res) => {
  try {
    const reqQuery = req.query;
    const id = Number(reqQuery.id);
    const photo = await Prisma.photo.findFirst({
      where: { id },
    });

    if (!photo) {
      return res.status(400).json({ success: false, error: 'Photo not found' });
    }

    const filePath = photo.link;

    const uploadsDir = path.join(process.cwd(), '/public');

    const fullFilePath = path.join(uploadsDir, filePath);

    if (!fs.existsSync(fullFilePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    fs.unlinkSync(fullFilePath);

    await Prisma.photo.delete({
      where: { id },
    });

    return res.status(204).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ success: false, message: 'An error occurred', error });
  }
};

// export default AuthMiddleware(handler);
export default handler;
