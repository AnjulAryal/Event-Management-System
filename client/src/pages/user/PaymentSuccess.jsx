import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import Button from "../../components/ui/Button";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const hasProcessed = useRef(false);

    useEffect(() => {
        const processPayment = async () => {
            if (hasProcessed.current) return;
            hasProcessed.current = true;

            try {
                // In a real app, we would verify the transaction with eSewa here via our backend
                // For dev, we just assume success if we reach this page and have pending details
                
                const data = searchParams.get("data");
                if (!data) {
                    throw new Error("Invalid payment response");
                }

                // Decode base64 response from eSewa
                const decodedData = JSON.parse(atob(data));
                
                if (decodedData.status !== "COMPLETE") {
                    throw new Error("Payment not completed");
                }

                // We no longer rely on localStorage, everything is safe in the DB
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : null;

                if (!user || !user.token) {
                    throw new Error("User session expired");
                }

                // Verify the transaction and complete the registration via our API
                const res = await fetch(`/api/events/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ 
                        transaction_uuid: decodedData.transaction_uuid
                    })
                });

                const result = await res.json();

                if (res.ok) {
                    setStatus("success");
                    toast.success("Payment and Registration successful!");
                    setTimeout(() => navigate("/user-events"), 2000);
                } else {
                    throw new Error(result.message || "Registration failed after payment");
                }

            } catch (error) {
                console.error("Payment processing error:", error);
                setStatus("error");
                toast.error(error.message || "Payment verification failed");
            }
        };

        processPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-[40px] p-12 max-w-md w-full shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
                
                {status === "processing" && (
                    <>
                        <div className="w-20 h-20 border-4 border-[#5CB85C]/30 border-t-[#5CB85C] rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Processing Payment...</h2>
                        <p className="text-slate-500 font-medium">Please don't close this window.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                            <CheckCircle className="w-12 h-12 text-[#5CB85C]" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Payment Successful!</h2>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            Thank you! Your event registration is successful. A confirmation email has been sent to your address.
                        </p>
                        <Button 
                            onClick={() => navigate("/user-events")}
                            className="w-full bg-[#5CB85C] hover:bg-[#4AA14A] py-4 text-lg"
                        >
                            View My Events
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Payment Failed</h2>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            We couldn't verify your payment. If you were charged, please contact support.
                        </p>
                        <Button 
                            onClick={() => navigate("/all-events")}
                            className="w-full bg-slate-900 hover:bg-slate-800 py-4 text-lg"
                        >
                            Back to Events
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
