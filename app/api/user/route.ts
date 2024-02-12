import connectDB from '@/lib/mongoose'
import { authOptions } from '@/lib/utils'
import Admin from '@/models/admin.model'
import User from '@/models/user.model'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    const admin = await Admin.findOne({ email: email })
    if (admin)
      return NextResponse.json({
        status: 'success',
        user: { ...admin._doc, role: 'admin' },
      })

    const user = await User.findOne({ email: email })
    console.log({ ...user._doc, role: 'user' })
    if (user)
      return NextResponse.json({
        status: 'success',
        user: { ...user._doc, role: 'user' },
      })

    throw new Error('User not found')
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 'failed', error: `${error}` })
  }
}
