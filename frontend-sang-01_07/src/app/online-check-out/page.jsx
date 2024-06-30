"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./_components/CheckoutForm";
import { useSearchParams } from "next/navigation";
import { callAPI } from "../../utils/api-caller";
import { useAppContext } from "../../components/context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function OnlineCheckOutPage() {
    const { shoppingCart, setShoppingCart } = useAppContext();
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount');
    const customerName = searchParams.get('customerName');
    const address = searchParams.get('address');
    const phone = searchParams.get('phone');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    const deliveryMethod = searchParams.get('deliveryMethod');
    const paymentMethod = searchParams.get('paymentMethod');

    const options = {
        mode: 'payment',
        currency: 'usd',
        amount: amount * 100,
    };

    const onCheckout = async () => {
        try {
            const data = {
                customerName,
                address,
                phone,
                city,
                district,
                ward,
                deliveryMethod,
                paymentMethod,
            };
            const res = await callAPI("/check-out", "POST", data);
            if (res.ok) {
                console.log('Order updated in Strapi');
                setShoppingCart([]); // Clear the shopping cart
            } else {
                console.log('Failed to update order in Strapi', res);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <div className="pt-20">
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm amount={amount} onCheckout={onCheckout} />
            </Elements>
        </div>
    );
}

export default OnlineCheckOutPage;
