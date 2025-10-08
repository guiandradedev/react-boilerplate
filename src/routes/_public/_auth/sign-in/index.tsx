import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// import GoogleAuth from "../google-auth";

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { GoogleAuth } from "../_components/GoogleAuth";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute('/_public/_auth/sign-in/')({
  component: RouteComponent,
})

const signinSchema = z
  .object({
    email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
    password: z.string().nonempty("Senha é obrigatório"),
    remember: z.boolean(),

  })

type SignUpFormInputs = z.infer<typeof signinSchema>;

function RouteComponent() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<SignUpFormInputs>({
    resolver: zodResolver(signinSchema), // Usa o Zod para validação
    defaultValues: {
      email: "",
      password: "",
      remember: false
    },
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    if (!data.email || !data.password) {
      alert("Preencha todos os campos")
      return
    }
    try {
      await login({email: data.email, password: data.password}, data.remember)

      const params = new URLSearchParams(window.location.search)
      const redirect_url = params.get('redirect')

      if (redirect_url) {
        try {
          // normaliza e valida origem (protege contra open redirect)
          const target = new URL(redirect_url, window.location.origin)
          if (target.origin === window.location.origin) {
            // navega cliente-side preservando search/hash
            navigate({ to: target.pathname + target.search + target.hash })
            return
          }
        } catch (e) {
          // URL inválida => ignora e segue para dashboard
          navigate({ to: '/dashboard' })
        }
      }

      // sem redirect válido, vai para o dashboard
      navigate({ to: '/dashboard' })

    } catch (error) {
      console.log(error)
      alert("Erro ao logar")
    }


    console.log(data); // Substitua por lógica de cadastro
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      {/* Hero Section */}
      <div className="hidden md:flex flex-1 items-center justify-center py-8 px-4">
        <img
          src="/login.svg"
          alt="Signup Illustration"
          width={400}
          height={400}
          className="dark:invert"
        />
      </div>

      {/* Signup Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-lg w-full md:max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Autentique-se</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

            {/* Email Input */}
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu email"
                  {...form.register("email")}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.email?.message}
              </FormMessage>
            </FormItem>

            {/* Password Input */}
            <FormItem>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <FormControl>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  {...form.register("password")}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>

            <FormItem
              className="flex flex-row items-center gap-2"
            >
              <FormControl>
                <Checkbox
                  id="terms"
                  {...form.register("remember")}
                />
              </FormControl>
              <FormLabel htmlFor="terms" className="">Permanecer Logado</FormLabel>
            </FormItem>

            <div className="flex items-center gap-3">
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Form>

        <div className="w-full mt-6">
          <GoogleAuth />
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
