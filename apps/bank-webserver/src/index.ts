import express, { Request, Response } from "express"
import db from "@repo/db/client"
const app = express()
app.use(express.json())

interface paymentInformationType {
    token: string,
}

app.get("/", (req: Request, res: Response) => {
    res.send({ "ok": "ok" })
})

app.post("/hdfcWebHook", async (req: Request, res: Response) => {
    const paymentInformation: paymentInformationType = {
        token: req.body.token,
    }
    console.log(paymentInformation)
    try {
        const transaction = await db.onRampTransaction.findUnique({
            where: {
                token: paymentInformation.token
            },
            select: {
                status: true,
                amount: true,
                userId: true
            }
        })

        if (!transaction) {
            res.status(400).json({
                message: "Invalid request"
            })
            return
        }

        // If transaction has already done or is failed cancel the operation
        if (transaction && (transaction.status === "Success" || transaction.status === "Failure")) {
            res.status(400).json({
                message: "Transaction already processed or failed. Cannot proceed."
            })
            return;
        }

        // Lock the transaction for update to avoid race conditions
        const updatedTransaction = await db.onRampTransaction.update({
            where: {
                token: paymentInformation.token
            },
            data: {
                status: "Processing"
            }
        })

        await db.$transaction([
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token,
                    status: "Processing"
                },
                data: {
                    status: "Success"
                }
            }),
            db.balance.upsert({
                where: {
                    userId: transaction.userId
                },
                update: {
                    amount: {
                        increment: Number(transaction.amount)
                    }
                },
                create: {
                    userId: transaction.userId,
                    amount: Number(transaction.amount),
                    locked: 0
                }
            })
        ])

        res.json({
            message: "Transaction captured and balance updated successfully."
        })

    } catch (error) {
        console.error("Error processing webhook:", error)
        res.status(500).json({
            message: "Internal server error while processing webhook."
        })
    }
})

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});