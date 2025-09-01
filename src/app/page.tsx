'use client'

import { redirect } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

// Interface para tipagem dos produtos
interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export default function Home() {
  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-5">
      <div className="w-full max-w-5xl mx-auto px-5">
        <div className='bg-gray-100 p-10 rounded-sm'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold text-center'>Leilão do Frank</h1>
            <div className='my-12 w-full px-5 md:px-30'>
              <CarouselHome />
            <div className='grid grid-cols-2 gap-3 mt-10'>
              <Button className='w-full' onClick={() => window.location.href = "/login"}>Fazer login</Button>
              <Button variant={"outline"} className='w-full' onClick={() => window.location.href = "/sign-up"}>Criar conta</Button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselHome() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchRandomProducts = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('https://fakestoreapi.com/products')
      const allProducts: Product[] = await response.json()
      
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random())
      const randomProducts = shuffled.slice(0, 5)
      
      setProducts(randomProducts)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchRandomProducts()
  }, [])

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <p>Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <Carousel setApi={setApi} className="mx-auto w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className='md:basis-1/2' >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm line-clamp-2 h-10">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-4">
                  <div className="w-32 h-32 mb-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p>Lance mínimo:</p>
                    <p className="text-lg font-bold text-green-600">
                      R${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ⭐ {product.rating.rate} ({product.rating.count})
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
