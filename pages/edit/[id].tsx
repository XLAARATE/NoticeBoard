import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import { prisma } from '../../lib/prisma'
import NoticeForm, { NoticeFormValues } from '../../components/NoticeForm'

type Notice = {
  id: number
  title: string
  body: string
  category: string
  priority: string
  publishDate: string
  imageUrl: string | null
}

type Props = {
  notice: Notice
}

export default function EditNotice({ notice }: Props) {
  const initialValues: Partial<NoticeFormValues> = {
    title: notice.title,
    body: notice.body,
    category: notice.category,
    priority: notice.priority,
    publishDate: notice.publishDate.slice(0, 10), // YYYY-MM-DD for <input type="date">
    imageUrl: notice.imageUrl ?? '',
  }

  async function handleSubmit(values: NoticeFormValues) {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json()
      return { error: data.error ?? 'Something went wrong' }
    }
    return {}
  }

  return (
    <>
      <Head>
        <title>Edit Notice — Notice Board</title>
      </Head>
      <NoticeForm
        heading="Edit notice"
        submitLabel="Save changes"
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = Number(ctx.params?.id)
  if (isNaN(id)) return { notFound: true }

  const notice = await prisma.notice.findUnique({ where: { id } })
  if (!notice) return { notFound: true }

  return {
    props: {
      notice: {
        id: notice.id,
        title: notice.title,
        body: notice.body,
        category: notice.category,
        priority: notice.priority,
        publishDate: notice.publishDate.toISOString(),
        imageUrl: notice.imageUrl,
      },
    },
  }
}
