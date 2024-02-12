import { NextResponse } from 'next/server'

export function handleError(err: any) {
  console.error(err)
  return NextResponse.json(
    { status: 'Some error occured!💥', error: err },
    {
      status: 400,
    },
  )
}
