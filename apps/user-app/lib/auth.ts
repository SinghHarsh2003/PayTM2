import db from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { z } from "zod"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

const credentialsSchema = z.object({
    name: z.string(),
    number: z.string(),
    password: z.string(),
})

const hashPassword = async (plainPassword: string) => {
    return bcrypt.hash(plainPassword, 10)
}

const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plainPassword, hashedPassword)
}

const createNewUser = async ({ name, number, password }: { name: string, number: string, password: string }) => {
    const hashedPassword = await hashPassword(password)
    const email = number + "@payop.id"

    return db.user.create({
        data: {
            name,
            number,
            email,
            password: hashedPassword,
        }
    })
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "Full Name", type: "text", placeholder: "Your full name..." },
                number: { label: "Phone Number", type: "text", placeholder: "Enter your phone number" },
                password: { label: "Password", type: "password", placeholder: "Enter a strong password" }
            },
            async authorize(credentials, req) {

                if (!credentials) return null

                // do zod validation, otp validation
                const result = credentialsSchema.safeParse(credentials)
                if (!result.success) return null;

                const { name, number, password } = result.data

                const existingUser = await db.user.findFirst({
                    where: { number }
                })

                if (existingUser) {
                    const success = await comparePassword(password, existingUser.password)
                    if (success)
                        return {
                            id: existingUser.id,
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    else return null
                }

                //hash the password
                try {
                    const newUser = await createNewUser({ name, number, password })
                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email
                    }
                } catch (err) {
                    console.log("Some error creating user", err)
                    return null
                }
            }
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async session({ token, session }: {token: JWT, session:Session}) {
            if (session.user) {
                // Type assertion: We are telling TypeScript that `session.user` will have an `id` property.
                // This is necessary because the default `Session` type does not include `id`.
                // We assert that `session.user` has an `id` and safely assign the `token.sub` value to it.
                (session.user as {id: string}).id = token.sub as string
            }
            return session
        }
    }
}