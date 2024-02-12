import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Navbar from '@/mycomponents/Navbar'
import { authOptions, getUserDetails } from '@/lib/utils'

export default async function HomeLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = await getUserDetails(
    session?.user?.email as string,
    session?.user?.name as string,
  )

  if (!session) {
    return redirect('/login')
  }

  return (
    <div>
      <Navbar user={user!} />
      <main className="w-full mx-auto">{children}</main>
    </div>
  )
}
