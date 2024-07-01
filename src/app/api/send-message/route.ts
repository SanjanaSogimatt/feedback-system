import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request)
{
    await dbConnect()
    const {username,content}=await request.json();
    try {
        const user=await UserModel.findOne({username})
        if(!user)
        {
            return Response.json({
                sucess:false,
                message:"User not found"
            },{status:404})
        }
        //is user accepting the mesages
        if(!user.isAcceptingMessage){
            return Response.json({
                sucess:false,
                message:"User not accepting the messages"
            },{status:403})
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            sucess:true,
            message:"message sent successfully"
        },{status:200})
    } catch (error) {
        console.log("Error sending messages: ",error)
        return Response.json({
            sucess:false,
            message:"Internal server error"
        },{status:500})
    }
}
