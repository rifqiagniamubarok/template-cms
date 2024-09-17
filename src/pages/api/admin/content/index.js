import { Prisma } from '@/libs/Prisma';
import AuthMiddleware from '@/middleware/AuthMiddleware';
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

const handleGet = async (req, res, session) => {
  try {
  } catch (error) {}
};

const postSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  thumbnail: Joi.string().optional().allow(null),
  status: Joi.string().valid('draft', 'publish').required(),
  body: Joi.string().optional().allow(null),
});

const handlePost = async (req, res, session) => {
  try {
    const { error, value } = postSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const isContentWithSameSlug = await Prisma.content.findFirst({
      where: {
        slug: value.slug,
      },
    });

    if (isContentWithSameSlug > 0) {
      return res.status(400).json({ success: false, error: 'Slug has been used' });
    }

    const content = await Prisma.content.create({
      data: value,
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
      },
    });

    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Something error, try again later!',
    });
  }
};

export default AuthMiddleware(handler);
