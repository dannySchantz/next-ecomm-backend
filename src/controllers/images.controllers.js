import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { validateImage } from '../validators/images.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { filter } from '../utils/common.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const allImages = await prisma.image.findMany();
  res.json(allImages);
});

router.post('/', async (req, res) => {
  const data = req.body;

  const validationErrors = validateImage(data);

  const token = req.headers.authorization.split(' ')[1]

  
  if (!token) {
    return res.status(401).send({ 'error': 'Unauthorized' })
  }
  const userData = await verifyAccessToken(token)
  // const userData = JSON.stringify(rawUserData)


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
    userId: userData.id,
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

router.delete('/:id', async (req, res) => {
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
