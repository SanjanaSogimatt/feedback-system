'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from '@/message.json'
import Autoplay from "embla-carousel-autoplay"
const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Dive deep into the world of anonymous conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore mystry message</p>
      </section>
      <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full max-w-xs">
        <CarouselContent>
          {
            message.map((msg, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardHeader>{msg.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <p className="text-xl font-semibold">{msg.content}</p>
                  </CardContent>
                  <CardFooter>
                    {msg.received}
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">
    2024 Mystry Message made with ❤️
  </footer>
  </>
  )
}
export default Home;