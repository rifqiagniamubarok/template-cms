import { Prisma } from '@/libs/Prisma';
import AuthMiddleware from '@/middleware/AuthMiddleware';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

function handler(req, res, session) {
  switch (req.method) {
    case 'GET':
      handleGet(req, res, session);
      break;
    case 'PUT':
      handlePut(req, res, session);
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
}

const handleGet = async (req, res, session) => {
  try {
    const { userId } = session;

    const user = await Prisma.user.findUnique({
      where: {
        id: userId,
      },
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
    return res.status(500).json({ success: false, error: 'Somthing wrong, try again later!', err: error });
  }
};

const editSchema = Joi.object({
  firstName: Joi.string().min(3).optional(),
  lastName: Joi.string().min(3).optional(),
  email: Joi.string().email().min(3).optional(),
  picture: Joi.string().allow(null).optional(),
});

const handlePut = async (req, res, session) => {
  try {
    const { userId } = session;
    const { error, value } = editSchema.validate(req.body);
    const randomUUID = uuidv4();

    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid request parameters.' });
    }

    value.tokenTempo = randomUUID;

    const user = await Prisma.user.update({
      where: {
        id: userId,
      },
      data: value,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        picture: true,
        tokenTempo: true,
      },
    });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ success: false, error: 'Somthing error, try again later!' });
  }
};

export default AuthMiddleware(handler);
