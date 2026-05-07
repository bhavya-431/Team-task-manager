const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      owner: true,
      tasks: {
        include: { assignee: true },
      },
    },
  });
  res.json(projects);
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, description, ownerId } = req.body;
  const ownerIdToUse = ownerId || req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const owner = await prisma.user.findUnique({ where: { id: ownerIdToUse } });
  if (!owner) {
    return res.status(404).json({ error: 'Owner user not found' });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: ownerIdToUse,
    },
  });
  res.status(201).json(project);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: true,
      tasks: {
        include: { assignee: true },
      },
    },
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

module.exports = router;
