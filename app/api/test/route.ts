import { RedirectType, redirect, useSearchParams } from 'next/navigation'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    return NextResponse.redirect(
      `http://localhost:3000/add-account/code=${code}`,
    )

    //  NextResponse.json({
    //   status: 'success',
    //   message: 'Copy the code and then, Go to redirect_url',
    //   redirect_url: 'http://localhost:3000/add-account',
    // })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 'error',
      message: 'Some error occured!',
      error,
    })
  }
}
