import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const [scriptLoadError, setScriptLoadError] = useState<string | null>(null)
  const router = useRouter()

  // Check if Razorpay script is loaded
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 50 // 5 seconds max wait time
    
    const checkRazorpay = () => {
      attempts++
      
      if (typeof window !== 'undefined' && window.Razorpay) {
        setIsRazorpayLoaded(true)
        setScriptLoadError(null)
      } else if (attempts >= maxAttempts) {
        setScriptLoadError("Payment gateway failed to load. Please refresh the page and try again.")
      } else {
        // Retry after a short delay
        setTimeout(checkRazorpay, 100)
      }
    }

    checkRazorpay()
  }, [])

  const handlePayment = async (planId: string, userId: string, planName: string, userData?: { name?: string; email?: string }) => {
    setIsLoading(true)
    
    try {
      // Check if Razorpay is loaded
      if (!isRazorpayLoaded) {
        if (scriptLoadError) {
          throw new Error(scriptLoadError)
        }
        throw new Error("Payment gateway is still loading. Please try again in a moment.")
      }

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

            // Activate subscription
            const activateResponse = await fetch("/api/subscription/activate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                planId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                planName,
                amount: orderData.amount / 100 // Convert from paise to rupees
              }),
            })

            if (activateResponse.ok) {
              // Redirect to success page
              const successUrl = `/payment/result?status=success&message=Payment completed successfully!&orderId=${response.razorpay_order_id}&amount=${orderData.amount / 100}&planName=${encodeURIComponent(planName)}`
              router.push(successUrl)
            } else {
              throw new Error("Failed to activate subscription")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            // Redirect to error page
            const errorUrl = `/payment/result?status=error&message=${encodeURIComponent(error instanceof Error ? error.message : "Payment verification failed")}&orderId=${response.razorpay_order_id}`
            router.push(errorUrl)
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled")
          }
        }
      }

      // Ensure Razorpay is available
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error("Payment gateway not available. Please refresh the page and try again.")
      }

      const razorpay = new window.Razorpay(options)
      
      // Add event listeners
      razorpay.on('payment.failed', function (response: any) {
        const errorUrl = `/payment/result?status=error&message=${encodeURIComponent("Payment failed: " + (response.error.description || "Unknown error"))}&orderId=${response.razorpay_order_id}`
        router.push(errorUrl)
      })

      razorpay.on('payment.cancelled', function () {
        toast.info("Payment was cancelled")
      })

      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to initiate payment")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { handlePayment, isLoading, isRazorpayLoaded, scriptLoadError }
}
