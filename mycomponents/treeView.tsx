import { Button } from '@/components/ui/button'
import { Triangle, TriangleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EntertainmentItem } from '@/app/(new)/home/view/[id]/details'

const VALID_VIDEO_EXTENSTION = ['ogg', 'mp4', 'webm', 'mov', 'mkv']

type TreeItem = {
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

const Item = ({
  items,
  id,
  addChildren,
  entertainmentItem,
  toggleShowChildren,
}: {
  items: Dic
  id: string
  addChildren: (onedriveItemId: string) => void
  entertainmentItem: EntertainmentItem
  toggleShowChildren: (id: string) => void
}) => {
  const router = useRouter()
  const item = items[id]
  return (
    <ul className="ml-4">
      <Button
        variant={'ghost'}
        className="text-white"
        onClick={() => {
          if (item.children && item.children.length != 0) {
            // console.log('Toggling children for', item.id)
            toggleShowChildren(item.id)
            return
          }
          if (item.file) {
            const extension = item.name.split('.').pop()

            if (VALID_VIDEO_EXTENSTION.includes(extension!)) {
              router.push(
                `/play?onedriveItemId=${item.id}&driveId=${entertainmentItem.onedrive_id}&accountId=${entertainmentItem.account}&folderId=${entertainmentItem.parent_folder}&backdrop_url=${entertainmentItem.backdrop_url}`,
              )
            }
            return
          }

          addChildren(item.id)
        }}
        disabled={
          (!item.folder || item.folder?.childCount == 0) &&
          !VALID_VIDEO_EXTENSTION.includes(item.name.split('.').pop()!)
        }
      >
        {item?.folder && item?.showChildren && (
          <Triangle size={14} className="rotate-180 mr-1" />
        )}
        {item?.folder && !item?.showChildren && (
          <Triangle size={14} className="rotate-90 mr-1" />
        )}

        {item.name}
      </Button>

      {item.showChildren &&
        item.children?.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            items={items}
            addChildren={addChildren}
            entertainmentItem={entertainmentItem}
            toggleShowChildren={toggleShowChildren}
          />
        ))}
    </ul>
  )
}

const TreeView = ({
  rootId,
  items,
  addChildren,
  entertainmentItem,
  toggleShowChildren,
}: {
  rootId: string
  items: Dic
  addChildren: (onedrive_item_id: string) => void
  entertainmentItem: EntertainmentItem
  toggleShowChildren: (id: string) => void
}) => {
  return (
    <Item
      items={items}
      id={rootId}
      addChildren={addChildren}
      entertainmentItem={entertainmentItem}
      toggleShowChildren={toggleShowChildren}
    />
  )
  // return <h1 className="text-5xl">Hello</h1>
}

export default TreeView
