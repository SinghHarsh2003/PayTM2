"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client"

const transferMoney = async (receiver: string, amount: number) => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        console.log("Not logged in")
        return {
            message: "Invalid request receiver not found",
            status: 400
        }
    }

    const senderUserId = session.user.id
    const toUser = await db.user.findUnique({
        where: {
            number: receiver
        }
    })

    if (!toUser) {
        console.log("User not found")
        return {
            message: "User not found!"
        }
    }

    const toUserAccount = await db.balance.findUnique({
        where: {
            userId: toUser.id
        }
    })

    if (!toUserAccount) {
        return {
            message: "Cannot proceed! The selected user has not created his/her account."
        }
    }

    console.log("THis is the amount,", amount)
    try {
        await db.$transaction(async (tx) => {
            // lock this row in the database to prevent simultaneous updates 
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${senderUserId} FOR UPDATE`;

            const userBalance = await tx.balance.findUnique({
                where: {
                    userId: senderUserId
                },
                select: {
                    amount: true
                }
            })
            if (!userBalance || userBalance.amount < amount)
                throw new Error("Insufficient funds!")
            
            console.log("user balance is sufficient", userBalance)

            const res1 = await tx.balance.update({
                where: {
                    userId: senderUserId
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            })
            console.log("decremetned from the user", res1)
            const res2 = await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            })
            console.log("incremetned to the receiver", res2)

            await tx.p2PTransfer.create({
                data: {
                    amount: amount,
                    timeStamp: new Date(),
                    fromUserId: senderUserId,
                    toUserId: toUser.id
                }
            })
        })

        console.log("savely done the transaciton")
    } catch (err) {
        console.log(err)
        return {
            message: "Something wrong with the transfer process"
        }
    }
}

export default transferMoney