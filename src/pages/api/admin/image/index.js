import AuthMiddleware from '@/middleware/AuthMiddleware';
import dayjs from 'dayjs';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import Joi from 'joi';
import path from 'path';
import slugify from 'slugify';
import { Prisma } from '../../../../libs/Prisma';

// Disable Next.js bodyParser, since formidable will handle the request body
export const config = {
  api: {
    bodyParser: false,
  },
};

function handler(req, res, session) {
  switch (req.method) {
    case 'GET':
      handleGet(req, res, session);
      break;
    case 'POST':
      handlePost(req, res, session);
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

const schema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(7),
});

const handleGet = async (req, res, session) => {
  try {
    const { userId } = session;
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters.' });
    }

    const { page, pageSize } = value;

    const offset = (page - 1) * pageSize;
    const photos = await Prisma.photo.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      skip: offset,
      take: pageSize,
    });

    const totalPhotos = await Prisma.photo.count({
      where: {
        userId,
      },
    });

    const totalPages = Math.ceil(totalPhotos / pageSize);

    return res.status(200).json({
      success: true,
      data: photos,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalPhotos,
      },
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ success: false, error: 'Somthing error, try again later!' });
  }
};

const handlePost = async (req, res, session) => {
  try {
    const { userId } = session;

    const form = new IncomingForm();

    const uploadDir = path.join(process.cwd(), '/public/gallery');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      const file = files.images[0];
      const name = fields.name[0];

      if (!name) {
        return res.status(400).json({ error: 'Name not provide' });
      }

      const slugName = slugify(name);
      const fileExtension = path.extname(file.originalFilename || file.name);

      // Define the new file path with extension
      const newFileName = `${dayjs(new Date()).format('YYYYMMDDHHmmss-')}${slugName}${fileExtension}`;
      const newFilePath = path.join(uploadDir, newFileName);

      fs.renameSync(file.filepath, newFilePath);

      const savePayload = {
        userId,
        name: name,
        slug: slugName,
        link: `/gallery/${newFileName}`,
      };

      const result = await Prisma.photo.create({
        data: savePayload,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Something wrong, try again later!',
    });
  }
};

export default AuthMiddleware(handler);
