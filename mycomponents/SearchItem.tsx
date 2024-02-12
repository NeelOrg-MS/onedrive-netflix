import { EntertainmentItem } from '@/app/(new)/home/view/[id]/details'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SearchItem() {
  const [searchItems, setSearchItems] = useState<EntertainmentItem[]>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchInput.length > 0) {
        setLoading(true)
        const res = await fetch(
          `/api/entertainment/search?query=${searchInput}`,
        )
        const data = await res.json()
        setSearchItems(data.data.map((item: any) => item))
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
      setLoading(false)
    }
  }, [searchInput])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Search className="w-5 h-5 text-gray-300 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="min-h-[60vh] border-none">
        <div>
          <Input
            className="text-white w-full"
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              setSearchInput(e.target.value)
            }}
          />
          {loading && (
            <Card className="text-white bg-transparent border-none">
              <p>Loading...</p>
            </Card>
          )}
          <div className="flex flex-col mt-6">
            {!loading &&
              searchItems.map((item: EntertainmentItem, idx) => (
                <Link
                  href={`/home/view/${item._id}`}
                  key={idx}
                  className="bg-transparent hover:bg-gray-800 p-2 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex">
                    <img
                      className="h-20 rounded-lg object-fill"
                      src={item.cover_image}
                      alt={'oh no'}
                    />
                    <div className="ml-4 flex flex-col justify-between h-full">
                      <p className="text-white text-xl font-semibold">
                        {item.title.substring(0, 30) +
                          (item.title.length > 30 ? '...' : '')}
                      </p>
                      <p className="text-yellow-600">{item.rating}</p>
                      <p className="text-white">{item.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
            {!loading && searchItems.length === 0 && searchInput !== '' && (
              <Card className="text-white bg-transparent border-none">
                <p>No results found!</p>
              </Card>
            )}
          </div>
        </div>
        <DialogFooter className="items-end">
          <DialogClose>
            <Button variant={'destructive'}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
