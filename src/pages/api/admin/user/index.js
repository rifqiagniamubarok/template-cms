import { Prisma } from '@/libs/Prisma';
import AuthMiddleware from '@/middleware/AuthMiddleware';
import { hashBcrypt } from '@/utils/encryption';
import Joi from 'joi';

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

const getSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});

const handleGet = async (req, res, session) => {
  try {
    const { error, value } = getSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters.' });
    }
    const { page, pageSize } = value;

    const offset = (page - 1) * pageSize;
    const photos = await Prisma.user.findMany({
      orderBy: [
        {
          id: 'desc',
        },
      ],
      skip: offset,
      take: pageSize,
    });

    const total = await Prisma.user.count();

    const totalPages = Math.ceil(total / pageSize);

    return res.status(200).json({
      success: true,
      data: photos,
      pagination: {
        page,
        pageSize,
        totalPages,
        total,
      },
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ success: false, error: 'Something error, try again later' });
  }
};

const postSchema = Joi.object({
  picture: Joi.string().optional().allow(null),
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3).max(100),
  email: Joi.string().email().min(3).max(100),
  password: Joi.string().min(3).max(100),
});

const handlePost = async (req, res, session) => {
  try {
    const { error, value } = postSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters.' });
    }

    const isUserExist = await Prisma.user.count({
      where: { email: value.email },
    });

    if (isUserExist > 0) {
      return res.status(400).json({ success: false, error: 'Email has been used' });
    }

    value.password = await hashBcrypt(value.password);

    const user = await Prisma.user.create({
      data: value,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        picture: true,
      },
    });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ success: false, error: 'Something error, try again later' });
  }
};

export default AuthMiddleware(handler);
