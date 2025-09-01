'use client'

import { useEffect, useState } from "react";
import CategoriaService from "@/services/CategoriaService";
import { Button } from "@/components/ui/button";

export default function Leiloes() {
  return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className=' bg-gray-100 w-full h-screen p-10 px-30 rounded-sm '>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Leilões</h1>
        <div className='my-15'>
        </div>
        <div className='grid md:grid-cols-2 gap-3 mt-10'>
        </div>
        </div>
      </div>
    </div>
  );
}

