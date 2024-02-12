import connectDB from '@/lib/mongoose'
import Account from '@/models/account.model'
import { Model } from 'mongoose'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await connectDB()
    const accounts = await Account.find()

    const baseUrl = 'https://login.microsoftonline.com'
    const endpoint = '/common/oauth2/v2.0/token'

    const newTokens: string[] = []

    const authorizationCodeURL = new URL(endpoint, baseUrl)

    await Promise.all(
      accounts.map(async (account) => {
        const { _id, refresh_token, client_id, client_secret } = account
        authorizationCodeURL.searchParams.set('client_id', client_id)
        authorizationCodeURL.searchParams.set('client_secret', client_secret)
        authorizationCodeURL.searchParams.set(
          'scope',
          'Files.Read Files.Read.All Files.ReadWrite Files.ReadWrite.All Sites.Read.All Sites.ReadWrite.All offline_access',
        )
        authorizationCodeURL.searchParams.set('refresh_token', refresh_token)
        authorizationCodeURL.searchParams.set('grant_type', 'refresh_token')

        const newToken = await fetch(baseUrl + endpoint, {
          method: 'POST',
          body: authorizationCodeURL.searchParams.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          await newToken.json()
        newTokens.push(newAccessToken)

        return Account.findByIdAndUpdate(_id, {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        })
      }),
    )

    return NextResponse.json({ message: 'ok', newTokens }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 'error', error }, { status: 400 })
  }
}
