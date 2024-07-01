'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

import { signUpSchema } from "@/schemas/signUpSchema"
import { AxiosError } from "axios"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const page = () => {
    const { toast } = useToast()
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result=await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if(result?.error){
            if (result.error === 'CredentialsSignin') {
                toast({
                  title: 'Login Failed',
                  description: 'Incorrect username or password',
                  variant: 'destructive',
                });
              } else {
                toast({
                  title: 'Error',
                  description: result.error,
                  variant: 'destructive',
                });
            }
        }
        console.log(result?.url)
        if(result?.url){
            console.log('Sign in successful, redirecting...');
            toast({
                title:'Sign in success',
                description:"You have successfully signed in but you are not redirected"
            })
            router.replace('/dashboard')
        }
        
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-4">Sign in for anonymous adventures</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email/username" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type="submit">
                            Sign in
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>Do not have an account? <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">Sign up </Link> here</p>
                </div>
            </div>
        </div>
    )
}
export default page