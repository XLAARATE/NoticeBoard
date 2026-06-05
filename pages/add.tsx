import Head from 'next/head'
import NoticeForm, { NoticeFormValues } from '../components/NoticeForm'

export default function AddNotice() {
  async function handleSubmit(values: NoticeFormValues) {
    const res = await fetch('/api/notices', {
      method: 'POST',
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
        <title>Add Notice — Notice Board</title>
      </Head>
      <NoticeForm
        heading="Add notice"
        submitLabel="Create notice"
        onSubmit={handleSubmit}
      />
    </>
  )
}
