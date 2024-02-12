import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)

    const client_id = url.searchParams.get('client_id')
    const client_secret = url.searchParams.get('client_secret')
    const code = url.searchParams.get('code')

    if (
      client_id === null ||
      client_secret === null ||
      code === null ||
      client_id?.trim() === '' ||
      client_secret?.trim() === '' ||
      code?.trim() === ''
    ) {
      throw new Error('Invalid Inputs! Either of the three inputs are empty.')
    }

    const baseUrl = 'https://login.microsoftonline.com'
    const endpoint = '/common/oauth2/v2.0/token'
    const authorizationCodeURL = new URL(endpoint, baseUrl)

    authorizationCodeURL.searchParams.set('client_id', client_id)
    authorizationCodeURL.searchParams.set('client_secret', client_secret)
    authorizationCodeURL.searchParams.set('code', code)
    authorizationCodeURL.searchParams.set('grant_type', 'authorization_code')
    authorizationCodeURL.searchParams.set(
      'scope',
      'Files.Read Files.Read.All Files.ReadWrite Files.ReadWrite.All Sites.Read.All Sites.ReadWrite.All offline_access',
    )
    authorizationCodeURL.searchParams.set(
      'redirect_uri',
      `http://localhost:3000/api/auth-response`,
    )

    const response = await fetch(baseUrl + endpoint, {
      method: 'POST',
      body: authorizationCodeURL.searchParams.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })

    const { refresh_token, access_token } = await response.json()

    return NextResponse.json({ status: 'success', refresh_token, access_token })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 'error', error })
  }
}
