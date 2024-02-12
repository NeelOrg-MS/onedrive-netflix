import connectDB from '@/lib/mongoose'
import Account from '@/models/account.model'
import EntertainmentItem from '@/models/entertainmentItem.model'
import ParentFolder from '@/models/parentFolder.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const onedrive_item_id = url.searchParams.get('onedrive_item_id')
    const drive_id = url.searchParams.get('drive_id')
    const folder_id = url.searchParams.get('folder_id')
    const account_id = url.searchParams.get('account_id')
    const select = url.searchParams.get('select')

    if (
      !onedrive_item_id?.trim() ||
      !drive_id?.trim() ||
      !folder_id?.trim() ||
      !account_id?.trim()
    ) {
      return new Response('Missing required parameters', { status: 400 })
    }

    const account = await Account.findById(account_id)
    const { access_token } = account

    const graphDomain = 'https://graph.microsoft.com'
    const graphEndpoint = `/v1.0/me/drives/${drive_id}/items/${onedrive_item_id}/children`

    const childrenUrl = new URL(graphEndpoint, graphDomain)
    childrenUrl.searchParams.append('$top', '999')
    if (select?.trim()) {
      childrenUrl.searchParams.append('$select', select)
    }
    // childrenUrl.searchParams.append('$select', 'id,name')

    const graphResponse = await fetch(childrenUrl.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const graphData = await graphResponse.json()

    const { value } = graphData

    const children = value.map((child: any) => {
      const { id, name } = child
      return {
        onedrive_item_id: id,
        title: name,
        isFile: child.file !== undefined,
        isVideo:
          child.file &&
          (child.file.mimeType.split('/')[0] === 'video') !== undefined,
      }
    })

    return NextResponse.json({ status: 'success', value }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
