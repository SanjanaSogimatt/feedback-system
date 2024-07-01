import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request:Request)
{
    await dbConnect();
    try {
        const {username,code}=await request.json()
        const decodedUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodedUsername})
        if(!user)
        {
            return Response.json({
                sucess:false,
                message:"User not found"
            },{status:500})
        }
        const isCodeValid=user?.verifyCode == code
        const isCodeExpired=new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeExpired)
        {
            user.isVerified=true
            await user.save()
            return Response.json({
                sucess:true,
                message:"Account verified successfully"
            },{status:200})
        }
        else if(!isCodeExpired)
        {
            return Response.json({
                sucess:false,
                message:"Verification code has expired signup again to get a new code"
            },{status:400})
        }else{
            return Response.json({
                sucess:false,
                message:"Incorrect verification code"
            },{status:400})
        }
        
    } catch (error) {
        console.error('Error verifying user', error)
        return Response.json({
            sucess:false,
            message:"Error verifying user"
        },{status:500})
    }
}
