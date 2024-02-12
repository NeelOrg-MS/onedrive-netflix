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
import { RedirectType, redirect, usePathname, useRouter } from 'next/navigation'

const formSchema = z.object({
  client_id: z.string().min(3).max(100),
})

/*
Authorization Request: 
https://login.microsoftonline.com/{{tenant}}/oauth2/v2.0/authorize?client_id={{client_id}}&response_type={{response_type}}&redirect_uri={{redirect_uri}}&response_mode={{response_mode}}&scope={{scope}}&state={{state}}
*/

export default function handler() {
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //Building the URL for authorization request
    const baseUrl = 'https://login.microsoftonline.com'
    const endpoint = '/common/oauth2/v2.0/authorize'
    const url = new URL(endpoint, baseUrl)

    url.searchParams.set('client_id', values.client_id)
    url.searchParams.set(
      'redirect_uri',
      'http://localhost:3000/api/auth-response',
    )
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('response_mode', 'query')
    url.searchParams.set(
      'scope',
      'Files.Read Files.Read.All Files.ReadWrite Files.ReadWrite.All Sites.Read.All Sites.ReadWrite.All offline_access',
    )
    url.searchParams.set('state', 'asdf-1234')

    router.push(url.toString())
  }

  return (
    <div className="min-w-full mt-40 flex justify-center items-center align-middle">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input placeholder="Micheal Scofield" {...field} />
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
                    placeholder="your-name@domain.onmicrosoft.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center w-[100%]">
                  Client ID
                </FormLabel>
                <FormControl>
                  <Input placeholder="Web app client id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Get Code</Button>
        </form>
      </Form>
    </div>
  )
}
