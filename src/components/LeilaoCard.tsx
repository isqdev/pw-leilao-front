import { Button } from "@/components/ui/button";
import LeilaoService from "@/services/LeilaoService";
import { Eye, Pencil, Trash } from "lucide-react";

interface Leilao {
  id: number
  titulo: string
  descricao: string
  localDateTime: string
}

export function LeilaoCard({id, titulo, descricao, localDateTime}: Leilao) {
    const leilaoService = new LeilaoService()

    const deletar = async () => {
        try {
            const response = leilaoService.delete(id)
            console.log(response)
        } catch (err) {
            console.log(err)
        } 
    }

    return(
        <div className=" shadow p-3 rounded-sm">
            <p className="font-black">{titulo}</p> 
            <p>{descricao}</p>
            <div className="flex justify-between items-end">
            <p className="font-light">
            {new Date(localDateTime).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
            })} às {new Date(localDateTime).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
            <div className="flex mt-1 justify-self-end gap-1">
            <Button onClick={() => window.location.href = `/leiloes/${id}`}>
                <Eye/>
            </Button>
            <Button>
                <Pencil/>
            </Button>
            <Button onClick={deletar}>
                <Trash/>
            </Button>
            </div>
        </div>
      </div>
    )
}