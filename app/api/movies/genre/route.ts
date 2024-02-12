import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const genre = url.searchParams.get('genre') || 'Action'
    const limit = Number(url.searchParams.get('limit')) || 10

    const actionMovies = await EntertainmentItem.find({
      genre: {
        $regex: genre,
      },
    })
      .sort({
        rating: -1,
      })
      .limit(limit)

    return NextResponse.json(
      {
        status: 'success',
        length: actionMovies.length,
        actionMovies,
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}
