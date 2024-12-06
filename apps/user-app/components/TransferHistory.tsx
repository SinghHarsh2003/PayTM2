"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import prisma from "@repo/db/client"
import { Card } from "@repo/ui/Card"
import Center from "@repo/ui/Center"

const TransferHistory = async () => {
    const allTransfers = await getTransferHistory()
    if (!allTransfers || allTransfers.length === 0) {
        return (
            <Center>
                <div className="translate-y-[-20%] translate-x-[-30%]">
                    <Card title='Transfer History'>
                        <div className='text-center py-8 italic min-w-[300px]'>
                            No transfer history...
                        </div>
                    </Card>
                </div>
            </Center>
        )
    }
    return (
        <Center>
            <div className="translate-y-[-20%] translate-x-[-30%]">
                <Card title="Transfer History">
                    <div className="pt-3 flex flex-col gap-3">
                        {allTransfers.map(tx => (
                            <div key={tx.id} className="flex justify-between min-w-[400px]">
                                <div className="flex flex-col">
                                    <span className="text-sm">
                                        {tx.sender ? "Sended " : "Received "}
                                        INR
                                    </span>
                                    <span className="text-xs text-slate-600">
                                        {tx.date.toDateString()}
                                    </span>
                                </div>
                                <div className={`${tx.sender ? "text-red-600" : "text-green-600"}`}>
                                    {tx.sender ? "-" : "+"}{" Rs. " + tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </Center>
    )
}

const getTransferHistory = async () => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id)
        return []

    const userId = session.user.id

    const transfers = await prisma.p2PTransfer.findMany({
        where: {
            OR: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        },
        orderBy: {
            timeStamp: 'desc'
        }
    })
    console.log(transfers)
    return transfers.map(tx => (
        {
            id: tx.id,
            amount: tx.amount / 100,
            date: tx.timeStamp,
            sender: userId === tx.fromUserId
        }
    ))
}

export default TransferHistory