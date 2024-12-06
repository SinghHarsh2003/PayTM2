"use client"
import React from 'react'
import Center from '@repo/ui/Center'
import { Card } from '@repo/ui/Card'
import { Button } from '@repo/ui/Button'
import TextInput from '@repo/ui/TextInput'
import { useState } from 'react'
import transferMoney from '../lib/action/transferMoney'
import Loader from './Loader'
import { useRouter } from 'next/navigation'

const SendCard = () => {
    const [amount, setAmount] = useState<number>(0)
    const [receiveNumber, setReceiverNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return (
        <Center>
            <div className='translate-y-[-20%] translate-x-[-30%]'>
                <Card title='P2P'>
                    <TextInput label="Number" placeholder='Enter the receiver number' onChange={(e: any) => {
                        setReceiverNumber(e.target.value)
                    }} />
                    <TextInput type="number" label="Amount" placeholder='Enter the amount' onChange={(e: any) => {
                        setAmount(e.target.value)
                    }} />
                    <div className='mt-4 flex justify-center'>
                        <Button onClick={async () => {
                            setLoading(true)
                            await transferMoney(receiveNumber, Number(amount) * 100)
                            setLoading(false)
                            router.push("/transaction")
                        }}>
                            {loading ? <Loader /> : "Initiate Transfer"}
                        </Button>
                    </div>
                </Card>
            </div>
        </Center>
    )
}



export default SendCard