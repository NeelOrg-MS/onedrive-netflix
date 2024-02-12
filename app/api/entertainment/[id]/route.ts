import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB()
    const { id } = params
    const entertainmentItem = await EntertainmentItem.findById(id)
    return NextResponse.json(
      { status: 'success', entertainmentItem },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}
