import { SessionProvider } from 'next-auth/react'

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AppWrapper
