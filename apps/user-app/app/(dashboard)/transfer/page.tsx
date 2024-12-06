import React from 'react'
import AddMoneyCard from '../../../components/AddMoneyCard'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import prisma from '@repo/db/client'
import BalanceCard from '../../../components/BalanceCard'
import OnRampTransaction from '../../../components/OnRampTransaction'

const Transfer = async () => {
    const balance = await getBalance()
    const transactions = await getTransactions()

    return (
        <div className='w-screen'>
            <div className='text-4xl text-[#6a51a6] pt-8 mb-8 font-bold'>
                Transfer
            </div>
            <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2'>
                <div>
                    <AddMoneyCard />
                </div>
                <div>
                    <BalanceCard amount={balance?.amount || 0} locked={balance?.locked || 0} />
                    <div className='pt-4'>
                        <OnRampTransaction transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const getBalance = async () => {
    const session = await getServerSession(authOptions)
    if (!session)
        return
    const balance = await prisma.balance.findFirst({
        where: {
            userId: session?.user?.id
        }
    })

    console.log("balance is this -<",balance)

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

const getTransactions = async () => {
    const session = await getServerSession(authOptions)
    if (!session)
        return
    const transactions = await prisma.onRampTransaction.findMany({
        where: {
            userId: session?.user?.id
        },
        orderBy: {
            startTime: 'desc'
        }
    })
    console.log(transactions, "User is",)
    return transactions.map(tnxs => ({
        id: tnxs.id,
        time: tnxs.startTime,
        amount: tnxs.amount,
        status: mapStatus(tnxs.status),
        provider: tnxs.provider
    }))
}

enum StatusType {
    Failure = "Failure",
    Success = "Success",
    Processing = "Processing"
}

const mapStatus = (status: 'Failure' | 'Success' | 'Processing'): StatusType => {
    switch (status) {
        case 'Failure':
            return StatusType.Failure
        case 'Success':
            return StatusType.Success
        case 'Processing':
            return StatusType.Processing
        default:
            throw new Error(`Unexpected status: ${status}`)
    }
}

export default Transfer