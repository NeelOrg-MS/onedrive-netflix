import { type ClassValue, clsx } from 'clsx'
import { NextAuthOptions } from 'next-auth'
import { twMerge } from 'tailwind-merge'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from './mongoose'
import Admin from '@/models/admin.model'
import User from '@/models/user.model'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}

export const doJSON = (data: any) => JSON.parse(JSON.stringify(data))

export const getUserDetails = async (
  email: string,
  name: string,
): Promise<{
  name: string
  email: string
  status?: string
  role: string
} | null> => {
  try {
    if (!email || !name) return null
    await connectDB()
    const admin = await Admin.findOne({ email })

    if (admin) return doJSON({ ...admin._doc, role: 'admin' })

    // await User.deleteMany()
    let user = await User.findOne({ email })
    if (!user) user = await User.create({ name, email, status: 'created' })

    return doJSON({ ...user._doc, role: 'user' })
  } catch (error) {
    return null
  }
}
