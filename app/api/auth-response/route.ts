import { redirect, useSearchParams } from 'next/navigation'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const code = url.searchParams.get('code')
    return NextResponse.redirect(
      `${process.env.DEPLOYMENT_URL}/admin/add-account?code=${code}`,
    )
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Some error occured!',
      error,
    })
  }
}
