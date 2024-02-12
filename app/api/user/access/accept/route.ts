import connectDB from '@/lib/mongoose'
import User from '@/models/user.model'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    await connectDB()
    const { email } = await request.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { status: 'failed', error: 'User not found!' },
        {
          status: 404,
        },
      )
    }

    if (user.status !== 'pending') {
      return NextResponse.json(
        {
          status: 'failed',
          error: 'Improper state ' + user.status,
        },
        {
          status: 400,
        },
      )
    }

    await User.updateOne({ email }, { status: 'accepted' })

    return NextResponse.json(
      { status: 'success', message: 'Access request sent' },
      {
        status: 200,
      },
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'failed', error: `${error}` },
      {
        status: 500,
      },
    )
  }
}
