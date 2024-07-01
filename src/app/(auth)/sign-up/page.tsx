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
import {AxiosError} from "axios"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"


const Page = () => {
    const [username,setUsername] = useState('') 
    const [usernameMessage,setUsernameMessage] = useState('')
    const [isCheckingUsernmae,setIsCheckingUsername] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    

    const debounced=useDebounceCallback(setUsername,500)
    const {toast} = useToast()
    const router = useRouter()

    //zod implementation
    const form=useForm<z.infer<typeof signUpSchema>>({
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
    })
    useEffect(()=>{
      const checkUsername=async()=>{
        if(username){
          setIsCheckingUsername(true)
          setUsernameMessage(' ')
          try {
            const response=await axios.get(`/api/check-username-unique?username=${username}`)
            //console.log(response.data)
            setUsernameMessage(response.data.message)
          } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            setUsernameMessage(axiosError.response?.data.message || 'Error checking username')
          }finally{
            setIsCheckingUsername(false)
          }
        }
      }
      checkUsername()
    },[username])

    const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
      setIsSubmitting(true)
      try {
        //console.log(data)
        const response=await axios.post<ApiResponse>('/api/sign-up',data)
        toast({
          title:'Success',
          description:response.data.message,
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
        console.error('Error signing up',error)
        const axiosError=error as AxiosError<ApiResponse>
        let errorMessage=axiosError.response?.data.message
        toast({
          title:"Signup failed",
          description:errorMessage,
          variant:"destructive"
        })
        setIsSubmitting(false) 
      }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
              <p className="mb-4">Sign up for anonymous adventures</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsernmae && <Loader2 className="h-4 w-4 animate-spin"/>}
              <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' :'text-red-500' }  `} >
                {usernameMessage}
              </p>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}
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
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
              </>
            ):('Signup')
          }
        </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>Already have an account? <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">Sign in</Link></p>
            </div>
          </div>
        </div>
    )
}
export default Page