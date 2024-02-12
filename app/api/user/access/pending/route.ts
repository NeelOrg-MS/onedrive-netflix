import connectDB from '@/lib/mongoose'
import User from '@/models/user.model'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({ status: 'pending' }).limit(3)

    return NextResponse.json(
      {
        status: 'success',
        length: users.length,
        users,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'failed',
        error: `${error}`,
      },
      {
        status: 500,
      },
    )
  }
}
