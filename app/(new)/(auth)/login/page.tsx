import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import GithubSignInButton from '@/mycomponents/GithubSignInButton'
import GoogleSignInButton from '@/mycomponents/GoogleSignInButton'
import { authOptions } from '@/lib/utils'

export default async function Login() {
  const session = await getServerSession(authOptions)

  if (session) {
    return redirect('/home')
  }
  return (
    <div className="mt-24  rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:px-14">
      <div className="text-white">Welcome to</div>
      <div>
        <h1 className="text-3xl font-bold text-white">Onedrive Netflix</h1>
      </div>
      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GoogleSignInButton />
      </div>
    </div>
  )
}
