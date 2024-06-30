import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useAppContext } from "../../../components/context";
import { useSearchParams } from "next/navigation";

function CheckoutForm({ amount, onCheckout }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");
    const { shoppingCart, setShoppingCart } = useAppContext();
    const searchParams = useSearchParams();
    const address = searchParams.get('address');
    const phone = searchParams.get('phone');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    const deliveryMethod = searchParams.get('deliveryMethod');
    const paymentMethod = searchParams.get('paymentMethod');

    const handleError = (error) => {
        setErrorMessages(error.message);
        setLoading(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }
        onCheckout();

        try {
            const res = await fetch("/api/create-intent", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount }),
            });

            if (!res.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { client_secret } = await res.json();

            const result = await stripe.confirmPayment({
                clientSecret: client_secret,
                elements,
                confirmParams: {
                    return_url: "http://localhost:3001/",
                },
            });

            if (result.error) {
                console.log('Payment confirmation error:', result.error.message);
            } else {
                console.log('Payment confirmed, calling onCheckout');
                
            }
        } catch (error) {
            console.log('Error during payment process:', error);
            setErrorMessages(error.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="px-32 md:mx-[250px] mt-12">
                <PaymentElement />
                <button
                    className="bg-blue-600 p-2 text-white rounded-md w-full mt-6 hover:bg-blue-700"
                    disabled={loading}
                >
                    Submit
                </button>
                {errorMessages && <div className="mt-4 text-red-600">{errorMessages}</div>}
            </div>
        </form>
    );
}

export default CheckoutForm;
