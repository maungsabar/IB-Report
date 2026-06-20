import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { level } = req.query;
    const where = {};
    if (level) where.level = Number(level);
    const classes = await prisma.class.findMany({
      where,
      include: { homeroomTeacher: true },
      orderBy: { name: 'asc' },
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cls = await prisma.class.findUnique({
      where: { id: Number(req.params.id) },
      include: { homeroomTeacher: true },
    });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cls = await prisma.class.create({ data: req.body });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cls = await prisma.class.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.class.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
