'use client'

import { LeilaoCard } from "@/components/LeilaoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeilaoService from "@/services/LeilaoService";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface LeilaoPreview {
  id: number
  titulo: string
  descricao: string
  dataHoraInicio: string
}

interface Leilao extends LeilaoPreview {
  descricaoDetalhada: string
  dataHoraFim: Date
  observacao: string
  lanceMinimo: number
  valorIncremento: number
  categoria: string
}

interface Categoria {
  id: number
  nome: string
}

export default function Leiloes() {
  const [leiloes, setLeiloes] = useState<LeilaoPreview[]>([])
  const leilaoService = new LeilaoService()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("leiloes")

  const buscarLeiloes = async () => {
    try {
      setLoading(true)
      const response = await leilaoService.buscarTodos()
      setLeiloes(response.data.content)
      console.log(response)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const adicionarLeilao = async (data: Leilao) => {
    try {
      const response = await leilaoService.create(data)
      console.log(response);
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    buscarLeiloes()
  }, [])

  const {handleSubmit, register, formState: { isValid, errors }} = useForm<Leilao>()
    
  return (
    <>
        <Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
    <div>
      <Button variant={"ghost"} onClick={() => setTab("leiloes")}>Ver todos</Button>
      <Button variant={"ghost"} onClick={() => setTab("novo")}>+ Novo</Button>

    <div data-tab={tab} className="m-5 max-w-5xl mx-auto w-full grid md:grid-cols-1 gap-2 data-[tab=novo]:hidden">
      {leiloes.map((leilao, k) => (
        <LeilaoCard
        key={k}
        id={leilao.id}
        titulo={leilao.titulo}
        descricao={leilao.descricao}
        localDateTime={leilao.dataHoraInicio}
        />
      ))}
      </div>
      
      <div data-tab={tab} className="m-5 max-w-5xl mx-auto w-full grid md:grid-cols-1 gap-2 data-[tab=leiloes]:hidden">

        <form onSubmit={handleSubmit(adicionarLeilao)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
             <Label>Titulo</Label>
              <Input {...register("titulo")}/>
            </div>
            <div>
              <Label>Categoria</Label>
              <Input {...register("categoria")}/>
            </div>
          </div>
          
          
          <Label>Descricao</Label>
          <Input {...register("descricao")}/>
          <Label>Descricao detalhada</Label>
          <Input {...register("descricaoDetalhada")}/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data e hora de início</Label>
              <Input {...register("dataHoraInicio")}/>
            </div>
            <div>
              <Label>Data e hora final</Label>
              <Input {...register("dataHoraFim")}/>
            </div>
          </div>
          <Label>Oservacao</Label>
          <Input {...register("observacao")}/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Valor incremento</Label>
              <Input {...register("valorIncremento")}/>
            </div>
            <div>
              <Label>Lance mínimo</Label>
              <Input {...register("lanceMinimo")} required/>
            </div>
          </div> 
          <div className="flex gap-2 mt-3 justify-self-end">
            <Button type="button" variant="outline">Cancelar</Button>
            <Button disabled={!isValid}>Salvar</Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

