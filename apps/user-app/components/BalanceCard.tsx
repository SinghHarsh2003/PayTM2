import { Card } from '@repo/ui/Card'
import React from 'react'

const BalanceCard = ({ amount, locked }: {
    amount: number,
    locked: number
}) => {
    return (
        <Card title='Balance'>
            <BalanceData balanceType='Unlocked Balance' amount={amount / 100} />
            <BalanceData balanceType='Total locked Balance' amount={locked / 100} />
            <BalanceData balanceType='Total Balance' amount={(locked + amount) / 100} />
        </Card>
    )
}

const BalanceData = ({ balanceType, amount }: { balanceType: string, amount: number }) => {
    return (
        <div className='flex justify-between border-b border-slate-300 py-2'>
            <div>
                {balanceType}
            </div>
            <div>
                {amount} INR
            </div>
        </div>
    )
}

export default BalanceCard