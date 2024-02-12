import connectDB from '@/lib/mongoose'
import ParentFolder from '@/models/parentFolder.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const parentFolders = await ParentFolder.find().populate('account', 'name')

    return NextResponse.json(
      { status: 'success', parentFolders },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectDB()

    await ParentFolder.create(data)
    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
