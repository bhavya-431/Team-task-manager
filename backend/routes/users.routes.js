const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);

router.get('/', requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  res.json(users);
});

module.exports = router;
