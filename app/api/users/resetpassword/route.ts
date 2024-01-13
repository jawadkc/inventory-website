import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";



export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { token, password } = reqBody

        console.log(token);

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } });


        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }
        console.log(user);


        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        user.password = hashedPassword;

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        User.db.close();
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}