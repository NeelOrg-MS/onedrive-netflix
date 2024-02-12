'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'

const Page = () => {
  const [currentTab, setCurrentTab] = useState<string>('any')
  const [items, setItems] = useState<{ _id: string; title: string }[]>()
  const [currentItem, setCurrentItem] = useState<string>('')
  const [currentItemFields, setCurrentFields] = useState<any>({})

  useEffect(() => {
    try {
      const fetchItems = async (url: string) => {
        const response = await fetch(url)
        const data = await response.json()

        setItems(data.entertainmentItems)
      }

      currentTab === 'any'
        ? fetchItems('/api/entertainment?limit=5000000&select=title')
        : fetchItems('/api/entertainment/incomplete?select=title')
    } catch (error) {
      alert('Some error occured! Check console')
      console.error(error)
    }
  }, [currentTab])

  useEffect(() => {
    if (currentItem == '') return
    console.log('Fetching details of current item : ', currentItem)

    const fetchItem = async () => {
      const response = await fetch(`/api/entertainment/${currentItem}`)
      const data = await response.json()

      setCurrentFields(data.entertainmentItem)
    }

    fetchItem()
  }, [currentItem])

  console.log(Object.keys(currentItemFields))

  return (
    <div className="flex justify-center items-center text-center">
      <Tabs
        defaultValue="any"
        className="w-[400px]"
        onValueChange={(value) => {
          setCurrentTab(value)
        }}
      >
        <TabsList>
          <TabsTrigger value="any">Any</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
        </TabsList>
        <TabsContent value="any">
          <Card className="text-left">
            <CardHeader>
              <CardTitle>Any Entertainment Item</CardTitle>
              <CardDescription>
                You can update any entertainment item here...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) => {
                  setCurrentItem(value)
                }}
              >
                <SelectTrigger className="w-[290px]">
                  <SelectValue placeholder="Choose an Entertainment Item" />
                </SelectTrigger>
                <SelectContent>
                  {items &&
                    items.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incomplete">
          Change only the items whose IMDB ID is null.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
