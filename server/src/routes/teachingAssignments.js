import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/teaching-assignments?className=8A
router.get('/', async (req, res) => {
  try {
    const { className } = req.query;
    const where = {};
    if (className) where.className = className;

    const assignments = await prisma.teachingAssignment.findMany({
      where,
      include: { teacher: true, subject: true },
      orderBy: [{ className: 'asc' }, { subject: { name: 'asc' } }],
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/teaching-assignments — assign a teacher to a subject in a class
router.post('/', async (req, res) => {
  try {
    const { className, subjectId, teacherId } = req.body;
    const assignment = await prisma.teachingAssignment.upsert({
      where: {
        className_subjectId_teacherId: {
          className,
          subjectId: Number(subjectId),
          teacherId: Number(teacherId),
        },
      },
      update: {},
      create: {
        className,
        subjectId: Number(subjectId),
        teacherId: Number(teacherId),
      },
      include: { teacher: true, subject: true },
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/teaching-assignments/:id — change teacher for an assignment
router.put('/:id', async (req, res) => {
  try {
    const { teacherId } = req.body;
    const assignment = await prisma.teachingAssignment.update({
      where: { id: Number(req.params.id) },
      data: { teacherId: Number(teacherId) },
      include: { teacher: true, subject: true },
    });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/teaching-assignments/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.teachingAssignment.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
