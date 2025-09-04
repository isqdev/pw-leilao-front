'use client'

import { useEffect, useState } from "react";
import LeilaoService from "@/services/LeilaoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CategoriaService from "@/services/CategoriaService";

interface Leilao {
  id: number
  titulo: string
  descricao: string
  localDateTime: string
}

interface Categoria {
  id: number
  nome: string
}

export default function Leiloes() {
    const [leiloes, setLeiloes] = useState<Leilao[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [filtro, setFiltro] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedLeilao, setSelectedLeilao] = useState<Leilao | null>(null)
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)

    const leilaoService = new LeilaoService()

    const buscarLeiloes = async () => {
      try {
        setLoading(true)
        
        const resposta = await leilaoService.findAll()

        console.log('Leiloes:', resposta.data)
        
        const leiloesData = resposta.data.content || resposta.data
        
        if (Array.isArray(leiloesData)) {
          setLeiloes(leiloesData)
        } else {
          console.log('Resposta não é um array:', resposta.data)
          setLeiloes([])
        }
      } catch (err) {
        console.log('Erro:', err)
        setLeiloes([])
      } finally {
        setLoading(false)
      }
    }

    const buscarCategorias = async () => {
    try {
      setLoading(true)
      
      const categoriaService = new CategoriaService()
      const resposta = await categoriaService.findAll()
    
      console.log('Categorias:', resposta.data)
      
      const categoriasData = resposta.data.content || resposta.data
      
      if (Array.isArray(categoriasData)) {
        setCategorias(categoriasData)
      } else {
        console.log('Resposta não é um array:', resposta.data)
        setCategorias([])
      }
    } catch (err) {
      console.log('Erro completo:', err)
      setCategorias([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (categoriaId: string) => {
    const id = parseInt(categoriaId)
    setFiltro(id)
    
    if (id === 0) {
      // Se for "Todas as categorias", buscar todos os leilões
      buscarLeiloes()
    } else {
      // Buscar leilões filtrados por categoria
      buscarLeiloesFiltrados(id)
    }
  }

  const buscarLeiloesFiltrados = async (categoriaId: number) => {
    try {
      setLoading(true)
      
      const resposta = await leilaoService.findByCategory(categoriaId)

      console.log('Leiloes filtrados:', resposta.data)
      
      const leiloesData = resposta.data.content || resposta.data
      
      if (Array.isArray(leiloesData)) {
        setLeiloes(leiloesData)
      } else {
        console.log('Resposta não é um array:', resposta.data)
        setLeiloes([])
      }
    } catch (err) {
      console.log('Erro:', err)
      setLeiloes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDetail = (idLeilao) => {
    
  }

  useEffect(() => {
    buscarLeiloes()
    buscarCategorias()
  }, [])

    const handleEdit = (leilao: Leilao) => {
      setSelectedLeilao(leilao)
      setIsEditDrawerOpen(true)
    }

    const handleDelete = (id: number) => {
      leilaoService.delete(id)
      buscarLeiloes()
    }
    
  return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className='bg-gray-100 w-full p-10 sm:px-10 md:px-30 rounded-sm'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold justify-self-center mb-6'>Leilões</h1>
          <div className="flex gap-2 justify-between">
            <Select onValueChange={handleFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todas as categorias</SelectItem>
              {
                categorias.map((categoria, index) => 
                <SelectItem key={index} value={categoria.id.toString()}>
                  {categoria.nome}
                </SelectItem>)
              }
            </SelectContent>
          </Select>
            <Button onClick={() => setIsCreateDrawerOpen(true)}>+ Novo leilão</Button>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10'>
            {loading ? (
              <div className="col-span-full text-center p-8">
                <p>Carregando leilões...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center p-8">
                <p className="text-red-500">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={buscarLeiloes}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : Array.isArray(leiloes) && leiloes.length > 0 ? (
              leiloes.map((leilao, index) => 
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{leilao.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{leilao.descricao}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {new Date(leilao.localDateTime).toLocaleDateString('pt-BR')}
                    </p>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Ação</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(leilao)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(leilao.id)}>
                        Deletar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDetail(leilao.id)}>
                        Detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>
                </div>
              )
            ) : (
              <div className="col-span-full text-center p-8">
                <p>Nenhum leilão encontrado</p>
              </div>
            )}

            
          </div>
        </div>
      </div>

      <EditLeilaoModal 
        leilao={selectedLeilao}
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false)
          setSelectedLeilao(null)
        }}
        onSuccess={() => {
          buscarLeiloes() 
          setIsEditDrawerOpen(false)
          setSelectedLeilao(null)
        }}
      />

      <CreateLeilaoModal 
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          buscarLeiloes() 
          setIsCreateDrawerOpen(false)
        }}
      />
    </div>
  );
}

function EditLeilaoModal({ 
  leilao, 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  leilao: Leilao | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localDateTime: ''
  })

  useEffect(() => {
    if (leilao) {
      setFormData({
        titulo: leilao.titulo || '',
        descricao: leilao.descricao || '',
        localDateTime: leilao.localDateTime || ''
      })
    }
  }, [leilao])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!leilao) return

    try {
      const leilaoService = new LeilaoService()
      
      await leilaoService.update({
        id: leilao.id,
        ...formData
      })

      console.log('Leilão atualizado com sucesso')
      onSuccess()
    } catch (error) {
      console.error('Erro edit leilão:', error)
    } 
  }

  return (
    
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Leilão</DrawerTitle>
        </DrawerHeader>
        <div>

        <div className="px-4 py-2 space-y-4 max-w-sm w-full mx-auto">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título do leilão"
              />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              type="text"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Digite a descrição do leilão"
              />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="localDateTime">Data e Hora</Label>
            <Input
              id="localDateTime"
              name="localDateTime"
              type="datetime-local"
              value={formData.localDateTime}
              onChange={handleChange}
              />
          </div>
        </div>

        <DrawerFooter className="max-w-sm w-full mx-auto">
          <Button 
            onClick={handleSubmit}
            className="w-full"
            >
            Salvar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CreateLeilaoModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localDateTime: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        titulo: '',
        descricao: '',
        localDateTime: ''
      })
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const leilaoService = new LeilaoService()
      
      const response = await leilaoService.create(formData)
      console.log('Leilão criado com sucesso:', response)
      onSuccess()
    } catch (error) {
      console.error('Erro ao criar leilão:', error)
      alert('Erro ao criar leilão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Criar Novo Leilão</DrawerTitle>
          <DrawerDescription>
            Preencha os dados do novo leilão abaixo
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-titulo">Título</Label>
            <Input
              id="create-titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título do leilão"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="create-descricao">Descrição</Label>
            <Input
              id="create-descricao"
              name="descricao"
              type="text"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Digite a descrição do leilão"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="create-localDateTime">Data e Hora</Label>
            <Input
              id="create-localDateTime"
              name="localDateTime"
              type="datetime-local"
              value={formData.localDateTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <DrawerFooter>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !formData.titulo || !formData.descricao || !formData.localDateTime}
            className="w-full"
          >
            {loading ? 'Criando...' : 'Criar Leilão'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
      
    </Drawer>
  )
}