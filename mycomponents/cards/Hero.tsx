import Image from 'next/image'
import { EI } from '../../app/(new)/home/page'
import MovieButtons from '../MovieButtons'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default function Hero({ item }: { item: EI }) {
  return (
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
        <div className="flex gap-x-3 mt-4">
          <Link href={`/home/view/${item._id}`}>
            <Button className="text-lg font-medium p-6 bg-white text-black hover:bg-slate-300">
              <PlayCircle className="mr-2 h-6 w-6" /> Play
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
