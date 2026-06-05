import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { Category, Priority } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid notice id' })
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } })
      if (!notice) return res.status(404).json({ error: 'Notice not found' })
      return res.status(200).json(notice)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch notice' })
    }
  }

  if (req.method === 'PUT') {
    const { title, body, category, priority, publishDate, imageUrl } = req.body

    // Server-side validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }
    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Body is required' })
    }
    if (!publishDate) {
      return res.status(400).json({ error: 'Publish date is required' })
    }
    const date = new Date(publishDate)
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid publish date' })
    }
    if (category && !Object.values(Category).includes(category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }
    if (priority && !Object.values(Priority).includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' })
    }

    try {
      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category ?? Category.General,
          priority: priority ?? Priority.Normal,
          priorityOrder: priority === Priority.Urgent ? 1 : 0,
          publishDate: date,
          imageUrl: imageUrl?.trim() || null,
        },
      })
      return res.status(200).json(notice)
    } catch {
      return res.status(500).json({ error: 'Failed to update notice' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({ where: { id } })
      return res.status(204).end()
    } catch {
      return res.status(500).json({ error: 'Failed to delete notice' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed' })
}
