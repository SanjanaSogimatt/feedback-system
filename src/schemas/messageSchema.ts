import {z} from 'zod';

export const messageSchema=z.object({
        content:z
        .string()
        .min(10,{message:"Miniumum 10 characters"})
        .max(300,{message:"Maximum 300 characters"})
})