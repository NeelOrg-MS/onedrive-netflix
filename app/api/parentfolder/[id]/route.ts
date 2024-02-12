import connectDB from '@/lib/mongoose'
import ParentFolder from '@/models/parentFolder.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id
    const data = await request.json()
    await connectDB()

    const updatedParentFolder = await ParentFolder.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })

    return NextResponse.json(
      { status: 'success', updatedParentFolder },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id
    await connectDB()
    await ParentFolder.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
