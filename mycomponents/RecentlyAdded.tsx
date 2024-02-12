'use client'
import Image from 'next/image'
import { EI } from '@/app/(new)/home/page'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'

export default function RecentlyAdded({ data }: { data: EI[] }) {
  return (
    <Carousel className="max-w-[80%] md:max-w-[90%] lg:max-w-[90%] mx-auto mt-8">
      <CarouselContent>
        {data.map((movie, index) => (
          <CarouselItem
            key={index}
            className="basis-1/3 md:basis-1/4 lg:basis-1/5 hover:cursor-pointer"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Image
                  src={movie.cover_image}
                  alt="Movie"
                  width={450}
                  height={600}
                  className="rounded-sm w-full h-full object-cover"
                />
              </DialogTrigger>
              <DialogContent className="min-w-[80vw] min-h-[80vh] flex-col items-end border-none rounded-none">
                <Image
                  src={movie.backdrop_url}
                  className="w-full h-full object-cover absolute -z-10 brightness-[20%] rounded-lg"
                  width={1920}
                  height={1080}
                  alt="movie"
                />
                <DialogHeader className="w-full max-h-max">
                  <DialogTitle className="text-white text-2xl py-4">
                    {movie.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-zinc-400">
                    {movie.plot_summary}{' '}
                  </DialogDescription>
                  <DialogFooter className="">
                    <Link href={`/home/view/${movie._id}`}>
                      <Button className="text-lg p-6 bg-white text-black hover:bg-gray-200">
                        View
                      </Button>
                    </Link>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        className="text-lg p-6"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
