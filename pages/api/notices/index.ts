import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { Category, Priority } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priorityOrder: 'desc' },
          { createdAt: 'desc' },
        ],
      })
      return res.status(200).json(notices)
    } catch (error) {
  console.error(error)

  return res.status(500).json({
    error: String(error)
  })
}
  }

  if (req.method === 'POST') {
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
      const notice = await prisma.notice.create({
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
      return res.status(201).json(notice)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create notice' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}
