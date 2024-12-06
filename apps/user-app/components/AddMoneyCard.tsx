"use client"
import React, { useState } from 'react'
import { Card } from '@repo/ui/Card'
import TextInput from '@repo/ui/TextInput'
import Select from '@repo/ui/Select'
import { Button } from '@repo/ui/Button'
import { OnRampTransaction } from "../lib/action/createOnRampTransaction"

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

const AddMoneyCard = () => {
    const [amount, setAmount] = useState(0)
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl)
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "")
    const [errorMsg, setErrorMsg] = useState("")
    return (
        <Card title='Add Money'>
            <TextInput type='number' label='Amount (Rs)' placeholder='Amount' onChange={(e: any) => {
                setAmount(e.target.value)
            }} />
            <div className='py-4 pb-2 text-left font-medium text-sm'>Bank</div>
            <Select
                onSelect={(value) => {
                    const selectedBank = SUPPORTED_BANKS.find(x => x.name === value);
                    setRedirectUrl(selectedBank?.redirectUrl || ""); // Set the redirectUrl
                    setProvider(selectedBank?.name || ""); // Set the provider name (string)
                }}
                options={SUPPORTED_BANKS.map(x => ({
                    key: x.name,
                    value: x.name
                }))} />
            {
                errorMsg !== "" &&
                <div className='text-left my-1 italic text-red-600'>
                    {errorMsg}
                </div>
            }
            <div className='flex justify-center pt-2'>
                <Button onClick={async () => {
                    if (amount <= 0)
                        setErrorMsg("Amount can't be negative or 0")
                    else {
                        await OnRampTransaction(provider, amount)
                        window.location.href = redirectUrl || ""
                    }
                }}>
                    Add Money
                </Button>
            </div>
            
        </Card>
    )
}

export default AddMoneyCard