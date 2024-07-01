'use client'

import { messageSchema } from "@/schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
const SendMessages = () => {
    const { username } = useParams<{ username: string }>()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })
    async function onSubmit(data: z.infer<typeof messageSchema>) {
        setIsLoading(true)
        try {
            const response = await axios.post(`/api/send-message/`, {
                ...data,
                username
            })
            toast({
                title: "Success",
                description: response.data.message,
                variant: "default"
            })
            form.reset({ content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Error in sending the messages",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)

        }
    }
    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send anonymous message to  @{username} </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit">Send</Button>
                        )}
                    </div>
                </form>
            </Form>
            <div className="text-center mt-auto">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
       
        
    )
}
export default SendMessages