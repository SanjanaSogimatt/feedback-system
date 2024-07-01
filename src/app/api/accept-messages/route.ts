import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request)
{
    await dbConnect()

    const session =await getServerSession(authOptions)
    const user:User=session?.user as User //assertion
    if(!session || !session.user)
    {
        return Response.json({
            sucess:false,
            message:"Not authenticated"
        },{status:401})
    }
    const userId=user._id
    const {acceptMessages}=await request.json()

    try {
        
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if(!updatedUser){
            return Response.json({
                sucess:false,
                message:"Error checking username"
            },{status:401})
        }
        return Response.json({
            sucess:true,
            message:"Message acceptance status updated successfully",
            updatedUser
        },{status:200})
    } catch (error) {
        return Response.json({
            sucess:false,
            message:"Failed to update user status to accept messages"
        },{status:500})
    }

}

export async function GET(request:Request)
{
    await dbConnect()

    const session =await getServerSession(authOptions)
    const user:User=session?.user as User //assertion
    if(!session || !session.user)
    {
        return Response.json({
            sucess:false,
            message:"Not authenticated"
        },{status:401})
    }
    const userId=user._id;
    try {
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                sucess:false,
                message:"Error checking username"
            },{status:404})
        }
        
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            sucess:false,
            message:"Error getting message acceptance status"
        },{status:500})
    }
}