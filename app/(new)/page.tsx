import { getServerSession } from 'next-auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Home | Onedrive Netflix',
  description: 'A super sophisticated, and cheaper version of Netflix',
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/login')
  } else {
    return redirect('/home')
  }
}
