import { PaymentStatus } from "../enums/payments"
import { Payment } from "../entities/payment.entity"
import { Contract } from "../entities/contract.entity"

export const paymentCreator = (id: string, netAmount: number , paymentFee: number, contract: Contract) => {

    const payment = new Payment
    payment.transactionId = id
    payment.status = PaymentStatus.PAID
    payment.netAmount = Math.round(netAmount)
    payment.paymentFee = Math.round(paymentFee)
    // payment.contract_ = contract
    payment.paymentDate = new Date(Date.now())

    return payment
} 