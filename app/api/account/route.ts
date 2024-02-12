import connectDB from '@/lib/mongoose'
import Account from '@/models/account.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

interface Account {
  id?: string
  name: string
  email: string
  access_token: string
  refresh_token: string
  client_id: string
  client_secret: string
}

export async function GET(request: Request) {
  try {
    await connectDB()
    const accounts = await Account.find()

    return NextResponse.json({ status: 'success', accounts }, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(request: Request) {
  try {
    const data: Account = await request.json()
    await connectDB()

    await Account.create(data)
    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const data: Account = await request.json()
    await connectDB()
    const updatedAccount = await Account.findByIdAndUpdate(data.id, data, {
      new: true,
    })

    return NextResponse.json(
      {
        status: 'success',
        message: 'Account Updated Successfully!',
        account: updatedAccount,
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: Account = await request.json()
    await connectDB()
    await Account.findByIdAndDelete(id)

    return NextResponse.json({}, { status: 204 })
  } catch (error) {
    return handleError(error)
  }
}
