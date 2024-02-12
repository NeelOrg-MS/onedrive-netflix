'use client'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import TreeView from '@/mycomponents/treeView'

export type EntertainmentItem = {
  _id: string
  title: string
  parent_folder: string
  parent_folder_onedrive_id: string
  onedrive_item_id: string
  account: string
  webURL: string
  onedrive_id: string
  site_id: string
  backdrop_url: string
  cover_image: string
  rating: number
  genre: string
}

export type TreeItem = {
  // Onedrive item id
  id: string

  // file/folder name
  name: string

  webUrl: string

  folder?: {
    childCount: number
  }

  file?: {
    mimeType: string
  }

  size: number

  children?: TreeItem[]

  showChildren?: boolean
}

type Dic = {
  [key: string]: TreeItem
}

const getItemDetails = async (
  onedriveItemId: string,
  driveId: string,
  folderId: string,
  accountId: string,
  select?: string,
) => {
  try {
    const baseUrl = new URL(window.location.href)
    const requestUrl = new URL('/api/entertainment/item', baseUrl)
    requestUrl.searchParams.set('onedrive_item_id', onedriveItemId)
    requestUrl.searchParams.set('drive_id', driveId)
    requestUrl.searchParams.set('folder_id', folderId)
    requestUrl.searchParams.set('account_id', accountId)
    if (select) {
      requestUrl.searchParams.set('select', select)
    }

    const response = await fetch(requestUrl)
    const data = await response.json()

    return data.value
  } catch (error) {
    console.error(error)
  }
}

const getChildrenDetails = async (
  onedriveItemId: string,
  driveId: string,
  folderId: string,
  accountId: string,
  select?: string,
) => {
  try {
    const baseUrl = new URL(window.location.href)
    const requestUrl = new URL('/api/entertainment/children', baseUrl)
    requestUrl.searchParams.set('onedrive_item_id', onedriveItemId)
    requestUrl.searchParams.set('drive_id', driveId)
    requestUrl.searchParams.set('folder_id', folderId)
    requestUrl.searchParams.set('account_id', accountId)
    if (select) {
      requestUrl.searchParams.set('select', select)
    }

    const response = await fetch(requestUrl)
    const data = await response.json()
    return data.value
  } catch (error) {
    console.error(error)
  }
}

const ViewPage = ({ id }: { id: string }) => {
  const [entertainmentItem, setEntertainmentItem] =
    useState<EntertainmentItem>()

  // const [treeItems, setTreeItems] = useState<Record<string, TreeItem>>({})
  const [treeItems, setTreeItems] = useState<Dic>({})

  useEffect(() => {
    const fetchEntertainmentItemDetails = async () => {
      try {
        const url = new URL(`/api/entertainment/${id}`, window.location.href)
        console.log(url.toString())
        const response = await fetch(url.toString())
        const data = await response.json()

        const { onedrive_item_id, onedrive_id, parent_folder, account } =
          data.entertainmentItem

        const rootTreeItemDetails = await getItemDetails(
          onedrive_item_id,
          onedrive_id,
          parent_folder,
          account,
          'id,name,webUrl,file,size,folder,backdrop_url',
        )

        setTreeItems((prev) => {
          return {
            ...prev,
            [`${rootTreeItemDetails.id}`]: rootTreeItemDetails,
          }
        })

        setEntertainmentItem(data.entertainmentItem)
      } catch (error) {
        alert('Refreshing the page...')
      }
    }

    fetchEntertainmentItemDetails()
  }, [id])

  const toggleShowChildren = (id: string) => {
    setTreeItems((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          showChildren: !prev[id]?.showChildren,
        },
      }
    })
  }

  const addChildrenToTreeItem = async (onedriveItemId: string) => {
    const details: TreeItem[] = await getChildrenDetails(
      onedriveItemId,
      entertainmentItem!.onedrive_id,
      entertainmentItem!.parent_folder,
      entertainmentItem!.account,
    )

    setTreeItems((prev) => {
      return {
        ...prev,
        [`${onedriveItemId}`]: {
          ...prev[`${onedriveItemId}`],
          children: details,
          showChildren: true,
        },
      }
    })

    for (const detail of details) {
      setTreeItems((prev) => {
        return {
          ...prev,
          [`${detail.id}`]: {
            ...detail,
            showChildren: false,
          },
        }
      })
    }
  }

  return (
    <>
      {entertainmentItem && treeItems ? (
        <div className="w-fit">
          <TreeView
            rootId={entertainmentItem.onedrive_item_id}
            items={treeItems}
            addChildren={addChildrenToTreeItem}
            entertainmentItem={entertainmentItem}
            toggleShowChildren={toggleShowChildren}
          />
        </div>
      ) : (
        <Loader2 className="animate-spin" size={20} color="white" />
      )}
    </>
  )
}

export default ViewPage
