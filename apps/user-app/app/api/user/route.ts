import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../../lib/auth"

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({
            message: "You need log in again!"
        })

        if (session.user) {
            return NextResponse.json({
                user: session.user
            })
        }

        return NextResponse.json({
            message: "test12 user created"
        },
            { status: 403 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            message: "Internal server error"
        })
    }
}