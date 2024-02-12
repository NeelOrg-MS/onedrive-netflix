'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRightIcon,
  ArrowRightSquare,
  Flame,
  IceCreamIcon,
  Plus,
  Trash,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Folder = {
  _id: string
  folder_name: string
  account: {
    _id: string
    name: string
  }
}

type Account = {
  _id: string
  name: string
}

const formSchema = z.object({
  folder_name: z.string().min(3).max(50),
  account_name: z.string().min(5).max(100),
})

const FolderPage = () => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folder_name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.folder_name == '')
        throw Error('Folder name should not be empty')

      if (values.account_name == null || values.account_name == '')
        throw Error('No Account Selected')

      await fetch(`/api/parentfolder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: values.account_name,
          folder_name: values.folder_name,
        }),
      })

      const response = await fetch(`/api/parentfolder`)
      const data = await response.json()
      setFolders(data.parentFolders)

      setOpen(false)

      toast({
        title: 'Folder added successfully',
        description: 'Folder has been added successfully',
      })
    } catch (error: any) {
      // alert(error)
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: `${error.message}`,
      })
    }

    // reset the values
    form.reset({
      folder_name: '',
      account_name: '',
    })
  }

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(`/api/parentfolder`)
        const accountResponse = await fetch(`/api/account`)

        const data = await response.json()
        const accountData = await accountResponse.json()

        setFolders(data.parentFolders)
        setAccounts(accountData.accounts)
      } catch (error) {
        alert(error)
        toast({
          variant: 'destructive',
          title: 'Something went wrong!',
          description: 'Error in fetching folders',
        })
      }
    }

    fetchFolders()
  }, [])

  const deleteFolder = async (id: string) => {
    try {
      await fetch(`/api/parentfolder/${id}`, {
        method: 'DELETE',
      })
      const response = await fetch(`/api/parentfolder`)
      const data = await response.json()
      setFolders(data.parentFolders)

      toast({
        title: 'Folder deleted successfully',
        description: 'Folder has been deleted successfully',
      })
    } catch (error) {
      alert(error)
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Error in deleting folder',
      })
    }
  }

  const TableForm = () => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-white"
        >
          <FormField
            control={form.control}
            name="folder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Folder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of the root folder" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose the associated account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">
            <IceCreamIcon size={18} className="mr-1" />
            Add
            <ArrowRightIcon className="ml-2" size={17.5} />
          </Button>
        </form>
      </Form>
    )
  }

  const AddDialog = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus size={20} className="mr-1" />
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
            <DialogDescription>
              You can add new folders by typing the name of the parent folder
              where the Movies and Series are located.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="foldername" className="text-right">
                Folder Name
              </Label>
              <Input
                id="name"
                placeholder="folder xyz..."
                className="col-span-3 bg-white"
                onChange={(e) => {
                  form.setValue('folder_name', e.target.value)
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountname" className="text-right">
                Account
              </Label>
              <Select
                onValueChange={(value) => {
                  form.setValue('account_name', value)
                }}
                defaultValue=""
              >
                <SelectTrigger className="w-[280px] bg-white">
                  <SelectValue placeholder="Choose the associated account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                onSubmit(form.getValues())
              }}
            >
              <IceCreamIcon size={18} className="mr-1" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div
      className="w-[60%] flex flex-col justify-center mt-4 ml-auto mr-auto"
      suppressHydrationWarning={true}
    >
      <div className="flex justify-between items-end">
        <h1 className="text-xl mt-10 font-medium">Folders</h1>
        <AddDialog />
      </div>
      <div className="w-full ml-auto mr-auto rounded-md border mt-4">
        <Table>
          <TableCaption className="mb-4">
            A list of all the folders added in various accounts
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Folder Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folders.map((folder) => (
              <TableRow key={folder._id}>
                <TableCell>{folder.folder_name}</TableCell>
                <TableCell>{folder.account.name}</TableCell>
                <TableCell className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => deleteFolder(folder._id)}
                  >
                    <Trash2 className="mr-1" size={20} />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default FolderPage
