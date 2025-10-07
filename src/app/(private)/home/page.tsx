'use client'

import { useEffect, useState } from "react";
import CategoriaService from "@/services/CategoriaService";
import LeilaoService from "@/services/LeilaoService";
import { Button } from "@/components/ui/button";

export default function Home() {

    return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className=' bg-gray-100 w-full p-10 sm:px-10 md:px-30 rounded-sm mb-10'>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Leilões</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-10'>
        </div>
        <div className="justify-self-end">
          <Button className='w-40' onClick={() => window.location.href = "/leiloes"}>Ver mais</Button>
        </div>
        </div>
      </div>
      <div className=' bg-gray-100 w-full p-10 sm:px-10 md:px-30 rounded-sm'>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Categorias</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-10'>
        </div>
        <div className="justify-self-end">
          <Button className='w-40' onClick={() => window.location.href = "/categorias"}>Ver mais</Button>
        </div>
        </div>
      </div>
    </div>
  );
}

