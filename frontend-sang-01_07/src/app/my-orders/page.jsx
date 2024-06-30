"use client";

import OrderItem from "../../components/order-item";
import { callAPI } from "../../utils/api-caller";
import { useEffect, useState } from "react";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await callAPI("/my-orders", "GET");
            console.log(res.data);
            // Sort orders by created date, latest first
            const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelOrder = (orderId) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: 'Đã hủy' } : order
            )
        );
    };

    // Get current orders
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="min-h-screen h-full bg-gray-100 pt-20" style={{ fontFamily: 'ALEGREYA-NORMAL' }}>
            <h1 className="mb-10 text-center text-2xl font-bold">LỊCH SỬ MUA HÀNG</h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div className="rounded-lg md:w-2/3">
                    {currentOrders.map((val, index) => (
                        <OrderItem
                            key={index}
                            orderId={val.id}
                            products={val.products}
                            totalPrice={val.totalPrice}
                            createdAt={val.createdAt}
                            paymentMethod={val.paymentMethod}
                            status={val.status}
                            deliveryMethod={val.deliveryMethod}
                            customerName={val.customerName}
                            address={val.address}
                            phone={val.phone}
                            ward={val.ward}
                            district={val.district}
                            city={val.city}
                            onCancel={handleCancelOrder}
                        />
                    ))}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, paginate }) => {
    return (
        <nav className="flex justify-center mt-4 mb-6">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-l disabled:opacity-50"
            >
                &lt; Previous
            </button>
            <span className="px-3 py-1 border-t border-b">
                Page {currentPage} / {totalPages}
            </span>
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-r disabled:opacity-50"
            >
                Next &gt;
            </button>
        </nav>
    );
};

export default MyOrders;
