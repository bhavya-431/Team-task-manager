const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { assigneeId: req.user.id };
  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: true,
      assignee: true,
    },
  });
  res.json(tasks);
});

router.post('/', requireAdmin, async (req, res) => {
  const {
    title,
    description,
    projectId,
    assigneeId,
    dueDate,
    status,
  } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({
      error: 'Title and projectId are required',
    });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
    });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'PENDING',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assigneeId: assigneeId || null,
    },

    include: {
      project: true,
      assignee: true,
    },
  });

  res.status(201).json(task);
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (req.user.role !== 'ADMIN' && task.assigneeId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { status },
    include: { project: true, assignee: true },
  });

  res.json(updated);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
  title,
  description,
  projectId,
  assigneeId,
  dueDate,
  status,
} = req.body;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const data = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined) data.status = status;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
  if (projectId !== undefined) data.projectId = projectId;
  if (assigneeId !== undefined) data.assigneeId = assigneeId;

  const updated = await prisma.task.update({
    where: { id },
    data,
    include: { project: true, assignee: true },
  });

  res.json(updated);
});

module.exports = router;
