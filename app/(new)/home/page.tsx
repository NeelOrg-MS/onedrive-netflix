import { Button } from '@/components/ui/button'
import connectDB from '@/lib/mongoose'
import { authOptions, doJSON, getUserDetails } from '@/lib/utils'
import Admin from '@/models/admin.model'
import EntertainmentItem from '@/models/entertainmentItem.model'
import User from '@/models/user.model'
import RecentlyAdded from '@/mycomponents/RecentlyAdded'
import RequestAccessButton from '@/mycomponents/RequestAccessButton'
import Hero from '@/mycomponents/cards/Hero'
import { CircleSlash, Clock } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export type EI = {
  _id: string
  title: string
  parent_folder: string
  parent_folder_onedrive_id: string
  onedrive_item_id: string
  account: string
  webURL: string
  onedrive_id: string
  site_id: string
  plot_summary: string
  backdrop_url: string
  cover_image: string
  genre: string
  imdb_id: string
  rating: number
  cast: string[]
}

const getRandomItem = async (): Promise<EI> => {
  await connectDB()
  const count = await EntertainmentItem.countDocuments()
  const random = Math.floor(Math.random() * count)

  const randomItem = await EntertainmentItem.findOne().skip(random)
  return doJSON(randomItem)
}

const getGenreMovies = async (
  genre: string,
  limit: number = 10,
): Promise<EI[]> => {
  await connectDB()
  const actionMovies = await EntertainmentItem.find({
    genre: {
      $regex: genre,
    },
  })
    .sort({
      rating: -1,
    })
    .limit(limit)
  return doJSON(actionMovies)
}

export default async function Homepage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const user = await getUserDetails(
    session?.user?.email || '',
    session?.user?.name || '',
  )

  const item = await getRandomItem()
  const actionMovies = await getGenreMovies('Action')
  const romanceMovies = await getGenreMovies('Romance')
  const thrillerMovies = await getGenreMovies('Thriller')
  const comedyMovies = await getGenreMovies('Comedy')
  const familyMovies = await getGenreMovies('Family')

  if (user?.role === 'user') {
    if (user.status === 'created') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <h2 className="text-white text-xl max-w-max mx-auto mt-4">
            You need to request admin for access
          </h2>
          <div className="max-w-max mx-auto mt-2">
            <RequestAccessButton email={user.email} />
          </div>
        </div>
      )
    } else if (user.status === 'pending') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <div className="max-w-max mx-auto mt-4 flex gap-2 items-center">
            <Clock size={20} color="white" />
            <h2 className="text-white text-xl">Your request is pending</h2>
          </div>
        </div>
      )
    } else if (user.status === 'rejected') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <div className="max-w-max mx-auto mt-4 flex gap-2 items-center">
            <CircleSlash size={20} className="text-red-600" />
            <h2 className="text-red-600 text-xl">
              Boss has rejected your request.
            </h2>
          </div>
        </div>
      )
    }
  }

  if (item === null) {
    return (
      <div className="w-screen mt-8">
        <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Welcome to OneDrive Netflix
        </h1>
        <h2 className="text-white text-xl max-w-max mx-auto mt-4">
          No items found
        </h2>
      </div>
    )
  }

  return (
    <>
      <Hero item={item} />
      <div className="bg-black max-w-7xl mx-auto">
        <h2 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Action Movies
        </h2>
        <RecentlyAdded data={actionMovies} />

        <h2 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Romance Movies
        </h2>
        <RecentlyAdded data={romanceMovies} />

        <h2 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Thriller Movies
        </h2>
        <RecentlyAdded data={thrillerMovies} />

        <h2 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Comedy Movies
        </h2>
        <RecentlyAdded data={comedyMovies} />

        <h2 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Family Movies
        </h2>
        <RecentlyAdded data={familyMovies} />

        <div className="h-20"></div>
      </div>
    </>
  )
}
