'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Home() {
  return (
    <>
      <CardSignUp />
    </>
  );
}

export function CardSignUp() {
  const schema = z.object({
    email: z.email(),
    password: z.string()
      .min(6, "Deve conter ao menos 6 caracteres")
      .regex(/[A-Z]/, "Deve conter ao menos 1 letra maiúscula")
      .regex(/[a-z]/, "Deve conter ao menos 1 letra minúscula")
      .regex(/[0-9]/, "Deve conter ao menos 1 número")
      .regex(/[^A-Za-z0-9]/, "Deve conter ao menos 1 caractere especial"),
  });

  type FormData = z.infer<typeof schema>;

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    criteriaMode: 'all',
  });

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Nome</Label>
              <Input
                id="name"
                type="text"
                required
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@email.com"
                {...register("email")}
                required
              />
                <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register("password")} required />
              <div>
                {errors.password?.types &&
                  Object.values(errors.password.types).map((msg, index) => (
                    <p key={index} className="text-red-500 text-sm whitespace-pre-line">
                      {msg}
                    </p>
                  ))
                }
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Criar conta
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <a href="/login">Já possui uma conta?</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
