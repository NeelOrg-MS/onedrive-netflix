'use client'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../public/netflix_logo.svg'
import { usePathname } from 'next/navigation'
import UserNav from './UserNav'
import SearchItem from './SearchItem'
import Notifications from './Notifications'
import { SessionProvider } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

interface linkProps {
  name: string
  href: string
  generalAccess: boolean
}

const links: linkProps[] = [
  { name: 'Home', href: '/home', generalAccess: true },
  { name: 'Admin', href: '/admin', generalAccess: false },
]

function Navbar({
  user,
}: {
  user: { name: string; email: string; role: string; status?: string }
}) {
  const pathName = usePathname()

  return (
    <SessionProvider>
      <div className="w-full max-w-7xl mx-auto items-center justify-between px-5 sm:px-6 py-5 lg:px-8 flex">
        <div className="flex items-center">
          <Link href="/home" className="w-32">
            <Image src={Logo} alt="Netflix logo" priority />
          </Link>
          <ul className="lg:flex gap-x-4 ml-14 hidden">
            {links.map((link, idx) => (
              <div key={idx}>
                {link.generalAccess || user?.role === 'admin' ? (
                  pathName === link.href ? (
                    <li>
                      <Link
                        href={link.href}
                        className="text-white font-semibold underline text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className="text-gray-300 font-normal text-sm"
                        href={link.href}
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                ) : (
                  <></>
                )}
              </div>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-x-8">
          {(user?.role === 'admin' ||
            (user?.role === 'user' && user?.status === 'accepted')) && (
            <SearchItem />
          )}
          {user?.role === 'admin' && <Notifications />}
          <UserNav />
        </div>
      </div>
    </SessionProvider>
  )
}

export default Navbar
