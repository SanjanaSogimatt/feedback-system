import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request:Request,{params}:{params:{messageid:string}})
{
    const messageId=params.messageid
    await dbConnect();
    const session =await getServerSession(authOptions)
    const _user:User=session?.user as User //assertion
    
    if(!session || !_user)
    {
        return Response.json({
            sucess:false,
            message:"Not authenticated"
        },{status:401})
    }

    try {
        const updateResult=await UserModel.updateOne(
            {_id:_user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount == 0)
        {
            return Response.json({
                success:false,
                message:"Message not found or already delete"
            },{status:404})
        }
        return Response.json({
            success:true,
            message:"Message deleted"
        },{status:200})

    } catch (error) {
        return Response.json({
            sucess:false,
            message:"Error deleting message"
        },{status:500})
    }
    
}