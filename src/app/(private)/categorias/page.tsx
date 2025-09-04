"use client";

import { useEffect, useState } from "react";
import CategoriaService from "@/services/CategoriaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Categoria {
  id?: number;
  nome: string;
  observacao: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const buscarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoriaService = new CategoriaService();
      const resposta = await categoriaService.findAll();

      console.log("Categorias:", resposta.data);

      const categoriasData = resposta.data.content || resposta.data;

      if (Array.isArray(categoriasData)) {
        setCategorias(categoriasData);
      } else {
        console.error("Resposta não é um array:", resposta.data);
        setCategorias([]);
        setError("Formato de dados inválido");
      }
    } catch (err) {
      console.error("Erro completo:", err);
      setCategorias([]);
      setError("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsEditDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        const categoriaService = new CategoriaService();
        await categoriaService.delete(id);
        buscarCategorias();
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        alert("Erro ao deletar categoria");
      }
    }
  };

  return (
    <div className="m-5 max-w-5xl mx-auto w-full">
      <div className="bg-gray-100 w-full p-10 px-30 rounded-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold justify-self-center mb-6">
            Categorias
          </h1>
          <div className="flex justify-center mb-6">
            <Button onClick={() => setIsCreateDrawerOpen(true)}>
              + Nova categoria
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
            {loading ? (
              <div className="col-span-full text-center p-8">
                <p>Carregando categorias...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center p-8">
                <p className="text-red-500">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={buscarCategorias}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : Array.isArray(categorias) && categorias.length > 0 ? (
              categorias.map((categoria, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2">{categoria.nome}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {categoria.observacao}
                  </p>
                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Ação
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(categoria)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(categoria.id!)}
                        >
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p>Nenhuma categoria encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditCategoriaModal
        categoria={selectedCategoria}
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedCategoria(null);
        }}
        onSuccess={() => {
          buscarCategorias();
          setIsEditDrawerOpen(false);
          setSelectedCategoria(null);
        }}
      />

      <CreateCategoriaModal
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          buscarCategorias();
          setIsCreateDrawerOpen(false);
        }}
      />
    </div>
  );
}

function EditCategoriaModal({
  categoria,
  isOpen,
  onClose,
  onSuccess,
}: {
  categoria: Categoria | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    nome: "",
    observacao: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome || "",
        observacao: categoria.observacao || "",
      });
    }
  }, [categoria]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!categoria) return;

    try {
      setLoading(true);
      const categoriaService = new CategoriaService();

      await categoriaService.update({
        id: categoria.id,
        ...formData,
      });

      console.log("Categoria atualizada com sucesso");
      onSuccess();
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      alert("Erro ao editar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Categoria</DrawerTitle>
          <DrawerDescription>
            Edite as informações da categoria abaixo
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nome">Nome</Label>
            <Input
              id="edit-nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome da categoria"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-observacao">Observação</Label>
            <Input
              id="edit-observacao"
              name="observacao"
              type="text"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Digite uma observação"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CreateCategoriaModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    nome: "",
    observacao: "",
  });
  const [loading, setLoading] = useState(false);

  // Limpar formulário quando fechar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nome: "",
        observacao: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const categoriaService = new CategoriaService();

      const response = await categoriaService.create(formData);
      console.log("Categoria criada com sucesso:", response);
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Criar Nova Categoria</DrawerTitle>
          <DrawerDescription>
            Preencha os dados da nova categoria abaixo
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-nome">Nome</Label>
            <Input
              id="create-nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome da categoria"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-observacao">Observação</Label>
            <Input
              id="create-observacao"
              name="observacao"
              type="text"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Digite uma observação"
              required
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.nome || !formData.observacao}
            className="w-full"
          >
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
