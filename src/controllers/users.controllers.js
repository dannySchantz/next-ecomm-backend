import express from 'express'
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import prisma from "../utils/prisma.js"
import { validateUser } from "../validators/users.js"
import { filter } from "../utils/common.js"
import sgMail from '@sendgrid/mail'

const router = express.Router()
 
const sendGridKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendGridKey)

router.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
})

// router.get('/:id', async (req, res) => {
//   try {
//     const userId = parseInt(req.params.id);
//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//       },
//     });

//     if (user) {
//       return res.json(user);
//     } else {
//       return res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.post('/', async (req, res) => {
  const data = req.body;

  const validationErrors = validateUser(data);

  if (Object.keys(validationErrors).length !== 0)
    return res.status(400).send({
      error: validationErrors,
    });

  data.password = bcrypt.hashSync(data.password, 8);

  try {
    const user = await prisma.user.create({
      data,
    });

    // const msg = {
    //   to: user.email,
    //   from: 'dschantz801@gmail.com',
    //   subject: 'Welcome to our website',
    //   text: 'Thank you for signing up!',
    //   html: '<strong>Thank you for signing up!</strong>',
    // };

    // await sgMail.send(msg);

    return res.json(filter(user, 'id', 'name', 'email'));
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      const formattedError = {};
      formattedError[`${err.meta.target[0]}`] = 'already taken';

      return res.status(500).send({
        error: formattedError,
      });
    }
    throw err;
  }
});

export default router