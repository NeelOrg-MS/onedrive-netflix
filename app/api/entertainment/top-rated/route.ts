import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const results = await EntertainmentItem.find()
      .sort({ rating: 'desc' })
      .limit(20)

    return Response.json({ status: 'success', results, length: results.length })
  } catch (error) {
    return handleError(error)
  }
}
