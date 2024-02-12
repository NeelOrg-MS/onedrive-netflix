'use client'

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu'
import Link from 'next/link'

const navItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Folder',
    href: '/old/folder',
  },
  {
    name: 'Accounts',
    href: '/old/accounts',
  },
  {
    name: 'Upcoming Features✨️',
    href: '/old/upcoming-features',
  },
]

export default function NavBar() {
  return (
    <NavigationMenu className="w-[100vw] mt-4">
      <NavigationMenuList className="flex flex-row justify-center">
        {navItems.map((item) => (
          <NavigationMenuItem className="ml-4" key={item.name}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
