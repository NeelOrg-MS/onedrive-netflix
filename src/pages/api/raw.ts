import connectDB from '@/lib/mongoose'
import Account from '@/models/account.model'
import EntertainmentItem from '@/models/entertainmentItem.model'
import ParentFolder from '@/models/parentFolder.model'
import { handleError } from '@/utils/errorHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import axios, { AxiosResponseHeaders } from 'axios'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    await connectDB()

    const { onedrive_item_id, drive_id, folder_id, account_id, select } =
      request.query

    if (
      !onedrive_item_id?.toString().trim() ||
      !drive_id?.toString().trim() ||
      !folder_id?.toString().trim() ||
      !account_id?.toString().trim()
    ) {
      return new Response('Missing required parameters', { status: 400 })
    }

    const account = await Account.findById(account_id)
    const { access_token } = account

    const graphDomain = 'https://graph.microsoft.com'
    const graphEndpoint = `/v1.0/me/drives/${drive_id}/items/${onedrive_item_id}`

    const requestUrl = new URL(graphEndpoint, graphDomain)
    requestUrl.searchParams.append('$top', '999')

    // childrenUrl.searchParams.append('$select', 'id,name')

    const graphResponse = await fetch(requestUrl.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const graphData = await graphResponse.json()

    if ('@microsoft.graph.downloadUrl' in graphData) {
      //   if ('size' in graphData && graphData['size'] < 4194304) {
      //     const { headers, data: stream } = await axios.get(
      //       graphData['@microsoft.graph.downloadUrl'] as string,
      //       {
      //         responseType: 'stream',
      //       },
      //     )
      //     headers['Cache-Control'] =
      //       'max-age=0, s-maxage=60, stale-while-revalidate'
      //     response.writeHead(200, headers as AxiosResponseHeaders)
      //     stream.pipe(response)
      //   } else {
      response.redirect(graphData['@microsoft.graph.downloadUrl'])
      //   }
    } else {
      response.status(404).json({ error: 'No download url found.' })
    }

    return
  } catch (error) {
    console.error(error)
    response.status(400).json({ status: 'fail', error: error })
    return
  }
}
