import { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '../globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'New OneDrive Netflix',
  description: 'A super sophisticated, and cheaper version of Netflix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>{children}</body>
      <Toaster />
    </html>
  )
}
