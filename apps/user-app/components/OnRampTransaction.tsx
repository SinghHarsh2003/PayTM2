import { Card } from '@repo/ui/Card'

enum StatusType {
    Failure = "Failure",
    Success = "Success",
    Processing = "Processing"
}

interface TransactionType {
    id: string,
    time: Date,
    amount: number,
    status: StatusType,
    provider: string
}

const statusColorMap = {
    [StatusType.Failure]: "bg-red-600",
    [StatusType.Success]: "bg-green-600",
    [StatusType.Processing]: "bg-yellow-600"
}

const OnRampTransaction = ({ transactions }: {
    transactions: TransactionType[] | undefined
}) => {
    if (!transactions || transactions.length === 0) {
        return (
            <Card title='Recent Transactions'>
                <div className='text-center py-8 italic'>
                    No recent transactions...
                </div>
            </Card>
        )
    }

    return (
        <Card title='Recent Transactions'>
            <div className='pt-2'>
                {transactions.map(t => (
                    <div key={t.id} className='flex justify-between items-center'>
                        <div>
                            <div className='text-sm'>
                                Received INR
                            </div>
                            <div className='text-slate-600 text-xs'>
                                {t.time.toDateString()}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center'>
                            + Rs {t.amount / 100}
                        </div>
                        <div className={`rounded-xl px-2 ${statusColorMap[t.status]} text-white text-sm`}>
                            {t.status}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default OnRampTransaction