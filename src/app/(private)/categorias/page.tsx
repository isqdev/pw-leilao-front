'use client'

import { useEffect, useState } from "react";
import CategoriaService from "@/services/CategoriaService";
import { Button } from "@/components/ui/button";

interface Categoria {
  nome: string
  observacao: string
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
    const [error, setError] = useState<string | null>(null)

    const buscarCategorias = async () => {
    
      try {
        setError(null)
        
        const categoriaService = new CategoriaService()
        const resposta = await categoriaService.findAll()
      
        console.log('Categorias:', resposta.data)
        setCategorias(resposta.data.content)
      } catch (err) {
        setError('Erro ao carregar categorias')
      } 
    }
    
    useEffect(() => {
      buscarCategorias()
    }, [])

  return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className=' bg-gray-100 w-full h-screen p-10 px-30 rounded-sm '>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Categorias</h1>
        <div className='my-15'>
        </div>
        <div className='grid md:grid-cols-2 gap-3 mt-10'>
          {categorias ? categorias.map((categoria, index) => 
            <div key={index} className="bg-white p-2 rounded-xl">
              <p className="font-bold">{categoria.nome}</p>
              <p className="">{categoria.observacao}</p>
            </div>
          ) :
             <p className="">Nenhuma categoria</p>
          }
        </div>
        </div>
      </div>
    </div>
  );
}

