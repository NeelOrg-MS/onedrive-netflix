'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function RequestAccessButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/access/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Access request sent', {
          duration: 5000,
          style: {
            backgroundColor: '#53cf58',
          },
        })
        router.refresh()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 5000,
        style: {
          backgroundColor: 'red',
        },
      })
    }
    setLoading(false)
  }

  return (
    <Button disabled={loading} onClick={handleClick}>
      Request Access
    </Button>
  )
}
