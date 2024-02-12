import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
import chalk from 'chalk'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const request_access_token = process.env.TMDB_ACCESS_TOKEN_AUTH
  const IMAGE_URL = 'https://image.tmdb.org/t/p/original'

  try {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${request_access_token}`,
        accept: 'application/json',
      },
    }

    // Getting Genre List
    const genreListUrl = new URL(
      '/3/genre/movie/list?language=en',
      'https://api.themoviedb.org',
    )
    const genreListResponse = await fetch(genreListUrl, options)
    const { genres } = await genreListResponse.json()

    // Get all entertainment Items
    await connectDB()
    const entertainmentItems = await EntertainmentItem.find({})

    await makeBatchRequests(entertainmentItems, 50, options, genres, IMAGE_URL)

    return NextResponse.json(
      {
        message: 'Updated Movies info...',
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

async function makeBatchRequests(
  items: any[],
  batchSize: number,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
  genres: any,
  IMAGE_URL: string,
) {
  try {
    for (let i = 0; i < items.length; i += batchSize) {
      const batchUrls = items.slice(i, i + batchSize)
      const promises = batchUrls.map((item) =>
        updateDetails(item, options, genres, IMAGE_URL),
      )

      await Promise.all(promises)

      // Optional: Introduce a delay between batches to avoid potential issues
      // For example, you can use setTimeout to introduce a delay (e.g., 1000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  } catch (error) {
    console.error('Error making batch requests:', error)
  }
}

async function updateDetails(
  item: any,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
  genres: any,
  IMAGE_URL: string,
) {
  // console.log(chalk.bgCyanBright('Finding : ', item.title))
  const title = item.title.split('(')[0].split('[')[0].trim()

  // const results = await getMovie(title, options)
  const results = await getMulti(title, options)
  if (results.total_results == 0) {
    console.log(chalk.redBright('Cannot find: ', title))
  } else {
    const bestResult = results.results[0]
    const moreMovieDetailsUrl = `https://api.themoviedb.org/3/${bestResult.media_type}/${bestResult.id}?language=en-US`
    const bestMovieResponse = await fetch(moreMovieDetailsUrl, options)
    const bestMovie = await bestMovieResponse.json()

    // update the entertainment Item with the new information...
    const id = item._id
    const genreAsString =
      bestMovie?.genres
        ?.map((genre: { id: string; name: string }) => genre.name)
        .join(', ') || null

    await EntertainmentItem.findByIdAndUpdate(
      id,
      {
        cover_image: IMAGE_URL + bestMovie.poster_path,
        plot_summary: bestMovie.overview,
        rating: bestMovie.vote_average,
        genre: genreAsString,
        imdb_id: bestMovie.imdb_id,
        backdrop_url: bestMovie.backdrop_path
          ? IMAGE_URL + bestMovie.backdrop_path
          : '',
      },
      { new: true },
    )
  }
}

async function getMovie(
  query: string,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  const searchMovieUrl = new URL(
    '/3/search/movie',
    'https://api.themoviedb.org',
  )
  searchMovieUrl.searchParams.set('query', query)
  const searchResponse = await fetch(searchMovieUrl, options)
  return await searchResponse.json()
}

async function getMulti(
  query: string,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  const searchMovieUrl = new URL(
    '/3/search/multi',
    'https://api.themoviedb.org',
  )
  searchMovieUrl.searchParams.set('query', query)
  const searchResponse = await fetch(searchMovieUrl, options)
  return await searchResponse.json()
}
