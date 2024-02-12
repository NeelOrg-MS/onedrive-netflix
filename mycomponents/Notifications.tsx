'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Notifications() {
  const [pendingUsers, setPendingUsers] =
    useState<{ name: string; email: string }[]>()
  const [fetchAgain, setFetchAgain] = useState(false)

  const grantUser = async (email: string) => {
    try {
      const response = await fetch('/api/user/access/accept', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      } else {
        setFetchAgain((prev) => !prev)
        toast.success('User access granted', {
          duration: 5000,
          style: {
            backgroundColor: '#53cf58',
          },
        })
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 5000,
        style: {
          backgroundColor: 'red',
        },
      })
    }
  }
  const rejectUser = async (email: string) => {
    try {
      const response = await fetch('/api/user/access/reject', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      } else {
        setFetchAgain((prev) => !prev)
        toast.success('User access rejected', {
          duration: 5000,
          style: {
            backgroundColor: '#ff7900',
          },
        })
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 5000,
        style: {
          backgroundColor: 'red',
        },
      })
    }
  }

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const reponse = await fetch('/api/user/access/pending')
        const data = await reponse.json()

        if (!reponse.ok) {
          throw new Error(data.error)
        }

        setPendingUsers(data.users)
      } catch (error) {
        toast.error(`${error}`, {
          duration: 5000,
          style: {
            backgroundColor: 'red',
          },
        })
      }
    }

    fetchPendingUsers()
  }, [fetchAgain])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-gray-300" />
          {pendingUsers != undefined && pendingUsers.length > 0 && (
            <div className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full select-none">
              &nbsp;
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-2xl mb-4">
            Grant User Access
          </DialogTitle>
          <DialogDescription>
            {pendingUsers?.length === 0 ? (
              <p className="text-white">No new Requests...</p>
            ) : (
              pendingUsers?.map((user) => (
                <Card className="mt-4">
                  <CardContent className="flex justify-between items-center py-2 px-4">
                    <div className="flex flex-col">
                      <p className="font-bold text-lg">{user.name}</p>
                      <p className="text-md">{user.email}</p>
                    </div>
                    <div className="flex">
                      <Button
                        className="mr-2 bg-green-600 hover:bg-green-500"
                        onClick={() => {
                          grantUser(user.email)
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant={'destructive'}
                        onClick={() => {
                          rejectUser(user.email)
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'destructive'}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
