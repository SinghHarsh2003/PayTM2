import GooglEProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GooglEProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOGGLE_CLIENT_SECRET || ""
        })
    ]
}