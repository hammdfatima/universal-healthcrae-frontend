"use client"

import { Star } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { testimonials } from "@/app/_lib/testimonials-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

const AUTOPLAY_DELAY_MS = 6000

function StarRating() {
  return (
    <div className="flex items-center justify-center gap-1">
      {(["star-1", "star-2", "star-3", "star-4", "star-5"] as const).map(
        (id) => (
          <Star
            key={id}
            className="size-5 fill-amber-400 text-amber-400"
            aria-hidden
          />
        )
      )}
      <span className="sr-only">5 out of 5 stars</span>
    </div>
  )
}

export default function TestimonialsSlider() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) {
      return
    }
    setCurrent(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api) {
      return
    }

    const interval = window.setInterval(() => {
      api.scrollNext()
    }, AUTOPLAY_DELAY_MS)

    return () => window.clearInterval(interval)
  }, [api])

  return (
    <section className="border-t border-border/60 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto max-w-2xl border-b border-border/80 pb-6">
          <Typography as="h2" variant="h2" className="text-2xl sm:text-3xl">
            Prepared when it matters most for your family
          </Typography>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          className="mt-10"
        >
          <CarouselContent className="-ml-0">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-0">
                <div className="mx-auto flex max-w-3xl flex-col items-center px-2">
                  <StarRating />

                  <blockquote className="mt-8">
                    <Typography
                      as="p"
                      variant="p"
                      className="text-base leading-relaxed text-muted-foreground italic sm:text-lg"
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </Typography>
                  </blockquote>

                  <Avatar className="mt-8 size-14">
                    <AvatarFallback
                      className={cn(
                        "text-sm font-semibold",
                        testimonial.avatarColor
                      )}
                    >
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>

                  <Typography as="p" variant="h5" className="mt-4 font-bold">
                    {testimonial.name}
                  </Typography>

                  <Typography
                    as="p"
                    variant="small"
                    className="mt-1 font-medium text-sky-500"
                  >
                    {testimonial.role}
                  </Typography>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-10 flex items-center justify-center gap-2.5">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className={cn(
                "size-2.5 rounded-full transition-all duration-300",
                current === index
                  ? "scale-110 bg-sky-500"
                  : "bg-sky-200 hover:bg-sky-300"
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
