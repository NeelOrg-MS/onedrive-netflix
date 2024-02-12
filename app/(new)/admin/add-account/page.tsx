/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  RedirectType,
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

const formSchema = z.object({
  code: z.string(),
  name: z.string().min(3).max(50),
  email: z.string().email().min(3).max(50),
  client_secret: z.string(),
  client_id: z.string(),
})

/*
Authorization Request: 
https://login.microsoftonline.com/{{tenant}}/oauth2/v2.0/authorize?client_id={{client_id}}&response_type={{response_type}}&redirect_uri={{redirect_uri}}&response_mode={{response_mode}}&scope={{scope}}&state={{state}}
*/

export default function handler() {
  const pathname = useSearchParams()
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: pathname?.get('code') || '',
      name: '',
      email: '',
      client_secret: '',
      client_id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //Building the URL for authorization request
    try {
      const searchParams = new URLSearchParams()
      searchParams.set('code', values.code)
      searchParams.set('client_id', values.client_id)
      searchParams.set('client_secret', values.client_secret)

      const tokenResponse = await fetch(`/api/token?${searchParams}`, {
        method: 'POST',
      })

      if (!tokenResponse.ok) {
        throw new Error('Something went wrong')
      }
      const { refresh_token, access_token } = await tokenResponse.json()

      const newAccountResponse = await fetch('/api/account', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          refresh_token,
          access_token,
          client_id: values.client_id,
          client_secret: values.client_secret,
        }),
      })

      if (!newAccountResponse.ok) throw new Error('Something went wrong')

      toast.success('Account Added Successfully! 🎉', {
        duration: 5000,
        style: {
          backgroundColor: 'green',
        },
      })

      router.push('/admin/accounts')
    } catch (error) {
      //show bogas snackbar
      toast.success('Something went wrong', {
        duration: 5000,
        style: {
          backgroundColor: 'red',
        },
      })
    }
  }

  return (
    <div className="min-w-full h-screen flex justify-center items-center align-middle">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Micheal Scofield"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="xyz@abc.onmicrosoft.com"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Code needs to come automatically"
                    {...field}
                    disabled
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123-940🪪"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Secret🔐"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={'default'}>
            Submit
          </Button>
          <Link className="ml-[5rem]" href="/admin/accounts">
            <Button variant={'default'}>Go to Accounts</Button>
          </Link>
        </form>
      </Form>
    </div>
  )
}
