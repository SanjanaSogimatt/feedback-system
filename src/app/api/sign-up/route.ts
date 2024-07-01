import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request:Request)
{
    await dbConnect()
    try {
        const {username,email,password}=await request.json()
        const exisitingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(exisitingUserVerifiedByUsername){
            return Response.json({
                success:true,
                message:"Username already taken"
            },
            {
                status:400
            }
        )
        }
        const exisitingUserByEmail=await UserModel.findOne({email})
        const verifyCode=Math.floor(100000 + Math.random()* 9000000).toString()
        if(exisitingUserByEmail){
            if(exisitingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email"
                },{status:400})
            }else{
                const hashedPassword=await bcrypt.hash(password,10)
                exisitingUserByEmail.password=hashedPassword
                exisitingUserByEmail.verifyCode=verifyCode
                exisitingUserByEmail.verifyCodeExpiry=new Date(Date.now()+36000000)
                await exisitingUserByEmail.save()
            }

        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save()
        }
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User registered successfully, please verify your email"
        },{status:200})
    } catch (error) {
        console.error('Error registering user',error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },{
                status:500
            }
        )
    }
}
