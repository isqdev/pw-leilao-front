'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import LeilaoService from '@/services/LeilaoService'
import { Button } from '@/components/ui/button'

interface Leilao {
  id: number
  titulo: string
  descricao: string
  descricaoDetalhada: string
  dataHoraInicio: string
  dataHoraFim: string
  observacao: string
  lanceMinimo: number
  valorIncremento: number
  categoria: string
}

export default function LeilaoDetalhes() {
  const params = useParams()
  const id = params.id as string
  
  const [leilao, setLeilao] = useState<Leilao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const leilaoService = new LeilaoService()

  const buscarLeilao = async () => {
    try {
      setLoading(true)
      const response = await leilaoService.findById(Number(id))
      setLeilao(response.data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar leilão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      buscarLeilao()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Carregando...</div>
      </div>
    )
  }

  if (error || !leilao) {
    return (
      <div className="m-5 max-w-5xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">
            {error || 'Leilão não encontrado'}
          </h1>
          <Button 
            className="mt-4" 
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="m-5 max-w-5xl mx-auto">
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          ← Voltar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{leilao.titulo}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Informações Gerais</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {leilao.id}</p>
              <p><strong>Categoria:</strong> {leilao.categoria}</p>
              <p><strong>Descrição:</strong> {leilao.descricao}</p>
              <p><strong>Descrição Detalhada:</strong> {leilao.descricaoDetalhada}</p>
              <p><strong>Observação:</strong> {leilao.observacao}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Detalhes do Leilão</h2>
            <div className="space-y-2">
              <p><strong>Início:</strong> {new Date(leilao.dataHoraInicio).toLocaleString('pt-BR')}</p>
              <p><strong>Fim:</strong> {new Date(leilao.dataHoraFim).toLocaleString('pt-BR')}</p>
              <p><strong>Lance Mínimo:</strong> R$ {leilao.lanceMinimo}</p>
              <p><strong>Valor Incremento:</strong> R$ {leilao.valorIncremento}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button>Fazer Lance</Button>
          <Button variant="outline">Adicionar aos Favoritos</Button>
        </div>
      </div>
    </div>
  )
}