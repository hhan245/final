"use client";
import { useAppContext } from "../../components/context";
import ShoppingCartItem from "../../components/shopping-cart-item";
import { callAPI } from "../../utils/api-caller";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/style.css";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;

const ShoppingCartPage = () => {
    const { shoppingCart, setShoppingCart, isFetchedShoppingCart, setIsFetchedShoppingCart } = useAppContext();
    const [totalPrice, setTotalPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [wards, setWards] = useState("");
    const [districts, setDistricts] = useState("");
    const [citis, setCitis] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!isFetchedShoppingCart) {
            fetchShoppingCart();
        } else {
            calcTotalPrice();
        }
    }, [shoppingCart, isFetchedShoppingCart]);

    const fetchShoppingCart = async () => {
        try {
            const res = await callAPI("/my-shopping-cart", "GET");
            console.log("Fetched Shopping Cart:", res.data); // Debugging statement
            setShoppingCart(res.data);
            setIsFetchedShoppingCart(true);
        } catch (error) {
            console.log("Error fetching shopping cart:", error); // Debugging statement
        }
    };

    const calcTotalPrice = () => {
        let sum = 0;
        if (Array.isArray(shoppingCart)) {
            for (let i = 0; i < shoppingCart.length; i++) {
                sum += +shoppingCart[i].price * +shoppingCart[i].amount;
            }
        }
        setTotalPrice(sum);
    };

    const add = async (productId) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount: 1 });
            console.log("Add Product Response:", res.data); // Debugging statement
            setShoppingCart(res.data);
            calcTotalPrice();
        } catch (error) {
            console.error(error);
        }
    };

    const decrease = async (productId) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount: -1 });
            console.log("Decrease Product Response:", res.data); // Debugging statement
            setShoppingCart(res.data);
            calcTotalPrice();
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async (productId, amount) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount });
            console.log("Remove Product Response:", res.data); // Debugging statement
            setShoppingCart(res.data);
        } catch (error) {
            console.error(error);
        }
    };


    const onCheckout = async () => {
        try {
            const data = {
                
                address,
                phone,
                wards,
                districts,
                citis,
            };
            const res = await callAPI("/check-out", "POST", data);
            setShoppingCart([]);
        } catch (error) {
            console.log(error);
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-20">
            <h1 className="mb-10 text-center text-2xl font-bold">GIỎ HÀNG</h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div className="rounded-lg md:w-2/3">
                    {!Array.isArray(shoppingCart) || shoppingCart.length === 0 ? (
                        <p className="text-center text-gray-700">Giỏ hàng của bạn đang trống.</p>
                    ) : (
                        shoppingCart.map((val, index) => (
                            <div key={index}>
                                <ShoppingCartItem
                                    productId={val.id}
                                    add={add}
                                    decrease={decrease}
                                    remove={remove}
                                    key={index}
                                    image={URL_SERVER + val.image[0].url}
                                    productName={val.name}
                                    price={val.price * val.amount}
                                    category={val.category.name}
                                    amount={val.amount}
                                />
                                {index < shoppingCart.length - 1 && <hr className="border-dashed border-gray-300 my-4" />}
                            </div>
                        ))
                    )}
                </div>
                {Array.isArray(shoppingCart) && shoppingCart.length > 0 && (
                    <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ fontFamily: "ALEGREYA-NORMAL" }}>
                        <p className="text-lg font-bold"> ĐƠN HÀNG </p>
                        <div>──────────────────────────</div>
                        <div className="mb-2 flex justify-between">
                            <p className="text-gray-700">Đơn hàng</p>
                            <p className="text-gray-700">{formatPrice(totalPrice)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-700">Giảm</p>
                            <p className="text-gray-700">0</p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between">
                            <p className="text-lg font-bold">TẠM TÍNH</p>
                            <div className="">
                                <p className="mb-1 text-lg font-bold">{formatPrice(totalPrice)}</p>
                            </div>
                        </div>
                        <button onClick={() => router.push("/check-out")} className="mt-6 w-full rounded-md bg-blue-500 py-1.5  text-blue-50 hover:bg-blue-600">THANH TOÁN</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartPage;
