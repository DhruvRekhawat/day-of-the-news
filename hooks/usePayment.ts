import { useState } from "react"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: any
  }
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async (planId: string, userId: string, planName: string) => {
    setIsLoading(true)
    
    try {
      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId, userId }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Day of the News",
        description: `Subscription to ${planName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            toast.success("Payment successful! You are now a premium user.")
            // Optionally redirect or refresh the page
            window.location.reload()
          } catch (error) {
            console.error("Payment verification error:", error)
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: "User Name", // You can get this from user data
          email: "user@example.com", // You can get this from user data
        },
        theme: {
          color: "#000000",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to initiate payment")
    } finally {
      setIsLoading(false)
    }
  }

  return { handlePayment, isLoading }
}
