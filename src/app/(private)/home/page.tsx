'use client'

import { useEffect, useState } from "react";
import CategoriaService from "@/services/CategoriaService";
import LeilaoService from "@/services/LeilaoService";
import { Button } from "@/components/ui/button";

interface Categoria {
  nome: string
  observacao: string
}

interface Leilao {
  titulo: string
  descricao: string
  localDateTime: string
}

export default function Home() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [leiloes, setLeiloes] = useState<Leilao[]>([])
    const [error, setError] = useState<string | null>(null)

    const buscarCategorias = async () => {
    
      try {
        setError(null)
        
        const categoriaService = new CategoriaService()
        const resposta = await categoriaService.find4()
      
        console.log('Categorias:', resposta.data)
        setCategorias(resposta.data)
      } catch (err) {
        setError('Erro em categorias')
      } 
    }
    
    useEffect(() => {
      buscarCategorias()
    }, [])

    const buscarLeiloes = async () => {
    
      try {
        setError(null)
        
        const leilaoService = new LeilaoService()
        const resposta = await leilaoService.findAll()
      
        console.log('Leiloes:', resposta.data)
        setLeiloes(resposta.data.content)
      } catch (err) {
        setError('Erro em leilões')
      } 
    }
    
    useEffect(() => {
      buscarLeiloes()
    }, [])

    return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className=' bg-gray-100 w-full p-10 px-30 rounded-sm mb-10'>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Leilões</h1>
        <div className='grid grid-cols-2 gap-3 my-10'>
            {leiloes ? leiloes.map((leilao, index) => 
            <div key={index} className="bg-white p-2 rounded-xl">
              <p className="font-bold">{leilao.titulo}</p>
              <p className="">{leilao.descricao}</p>
              <p className="">{leilao.localDateTime}</p>
            </div>
          ) :
             <p className="">Nenhuma categoria</p>
          }
        </div>
        <div className="justify-self-end">
          <Button variant={"outline"} className='w-40' onClick={() => window.location.href = "/leiloes"}>Ver mais</Button>
        </div>
        </div>
      </div>
      <div className=' bg-gray-100 w-full p-10 px-30 rounded-sm'>
        <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold justify-self-center'>Categorias</h1>
        <div className='grid grid-cols-2 gap-3 my-10'>
          {categorias ? categorias.map((categoria, index) => 
            <div key={index} className="bg-white p-2 rounded-xl">
              <p className="font-bold">{categoria.nome}</p>
              <p className="">{categoria.observacao}</p>
            </div>
          ) :
             <p className="">Nenhuma categoria</p>
          }
        </div>
        <div className="justify-self-end">
          <Button variant={"outline"} className='w-40' onClick={() => window.location.href = "/categorias"}>Ver mais</Button>
        </div>
        </div>
      </div>
    </div>
  );
}

