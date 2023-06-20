import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { validateImage } from '../validators/images.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { filter } from '../utils/common.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const allImages = await prisma.image.findMany();
  res.json(allImages);
});

router.post('/', auth, async (req, res) => {
  const data = req.body;

  const validationErrors = validateImage(data);

  const userId = req.user.payload.id

  // const token = auth.
  // if (!token) {
  //   return res.status(401).send({ 'error': 'Unauthorized' })
  // }

  if (Object.keys(validationErrors).length !== 0) {
    return res.status(400).send({
      error: validationErrors,
    });
  }

  const imageData = {
    id: data.id,
    file: data.file,
    name: data.name,
    price: data.price,
    title: data.title,
    description: data.description,
    created_at: data.created_at,
    userId: req.user.payload.id
  }

  try {
  const image = await prisma.image.create({
    data: imageData,
  });
  return res.json(image)
  } catch(err) {
    return res.status(500).send({ error: 'Failed to create image' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const image = await prisma.image.findUnique({
    where: {
      id: req.params.id
    }
  })

  if (req.user.id != image.userId) {
    return res.status(401).send({"error": "Unauthorized"})
  }
})

export default router;
