import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white fixed overflow-scroll w-screen h-screen">
      <nav className="flex max-w-max mx-auto mt-8">
        <ul className="flex gap-4">
          <li>
            <Link href="/admin/accounts">
              <Button variant={'secondary'}>Accounts</Button>
            </Link>
          </li>
          <li>
            <Link href="/admin/folder">
              <Button variant={'secondary'}>Folders</Button>
            </Link>
          </li>
          {/* <li>
            <Link href="/admin/update-entertainment-item">
              <Button variant={'secondary'}>Update Entertainmetn Items</Button>
            </Link>
          </li> */}
        </ul>
      </nav>
      {children}
    </div>
  )
}
