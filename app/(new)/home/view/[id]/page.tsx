import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { EI } from '../../page'
import ViewPage from './details'
import { getServerSession } from 'next-auth'
import { authOptions, doJSON, getUserDetails } from '@/lib/utils'
import { redirect } from 'next/navigation'

const getItem = async (id: string): Promise<EI> => {
  await connectDB()
  const item = await EntertainmentItem.findById(id)
  return doJSON(item)
}

export default async function ItemViewPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const item = await getItem(id)

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const user = await getUserDetails(
    session.user.email as string,
    session.user.name as string,
  )

  if (user?.role === 'user' && user?.status !== 'accepted') {
    redirect('/home')
  }

  return (
    <>
      <div
        className="w-full flex justify-center items-center"
        style={{ height: 'calc( 100vh - 80px )' }}
      >
        <img
          className="w-full absolute top-0 left-0 h-screen object-cover brightness-[60%] select-none -z-10"
          src={item.backdrop_url}
          alt={item.title}
        />
        <div className="absolute w-[90%] lg:w-[60%] mx-auto text-left">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
            {item?.title.split('(')[0].split('[')[0].split('-')[0]}
          </h1>
          <p className="text-white text-lg mt-5 line-clamp-3">
            {item?.plot_summary}
          </p>
        </div>
      </div>
      <div className="max-w-[80%] min-h-[20rem] mx-auto mt-8">
        <h1 className="text-white text-2xl font-bold mb-4">
          Browse the file below
        </h1>
        <ViewPage id={id} />
      </div>
    </>
  )
}
