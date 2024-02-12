import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const select = url.searchParams.get('select') || ''

    const incompleteItems = await EntertainmentItem.find({
      imdb_id: null,
    }).select(select)

    return NextResponse.json({
      status: 'success',
      entertainmentItems: incompleteItems,
    })
  } catch (error) {
    return handleError(error)
  }
}
