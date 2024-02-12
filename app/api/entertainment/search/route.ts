import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')

  await connectDB()
  const data = await EntertainmentItem.find({
    title: { $regex: query, $options: 'i' },
  }).limit(3)

  return NextResponse.json(
    { data },
    {
      status: 200,
    },
  )
}
