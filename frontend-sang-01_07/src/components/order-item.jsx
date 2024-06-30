import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { callAPI } from "../utils/api-caller";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA; // Ensure this is set correctly

const OrderItem = ({ orderId, products, totalPrice, createdAt, paymentMethod, status, deliveryMethod, customerName, address, phone, ward, district, city, onCancel }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formattedDate = format(new Date(createdAt), 'EEEE, dd/MM/yy', { locale: vi });

    const handleCancel = async () => {
        const confirmCancel = confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (!confirmCancel) return;

        try {
            const res = await callAPI(`/cancel-order/${orderId}`, 'POST');
            if (!res.error) {
                onCancel(orderId);
            } else {
                alert("An error occurred while cancelling the order.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while cancelling the order.");
        }
    };

    const getStatusStyle = () => {
        switch (status) {
            case 'Đã hủy':
                return 'bg-red-100 text-red-700 font-bold';
            case 'Đã xác nhận':
                return 'bg-yellow-100 text-yellow-700 font-bold';
            case 'Đã hoàn thành':
                return 'bg-green-100 text-green-700 font-bold';
            default:
                return '';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'Đã hủy':
                return <CloseOutlinedIcon className="text-red-700" />;
            case 'Đã xác nhận':
                return <LocalShippingOutlinedIcon className="text-yellow-700" />;
            case 'Đã hoàn thành':
                return <DoneOutlinedIcon className="text-green-700" />;
            default:
                return '';
        }
    };

    const getPaymentMethodText = () => {
        switch (paymentMethod) {
            case 'cod':
                return 'COD';
            case 'online':
                return 'Thẻ';
            default:
                return paymentMethod;
        }
    };
    const getDeliveryMethodText = () => {
        switch (deliveryMethod) {
            case 'standard':
                return 'Tiêu chuẩn';

            default:
                return deliveryMethod;
        }
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <>
            <div className="justify-between mb-6 rounded-lg bg-white p-6 " style={{ fontFamily: 'ALEGREYA-NORMAL' }}>
                <div className="sm:flex sm:justify-between">
                    <div className="flex flex-col mb-4 sm:mb-0 sm:flex-row sm:items-center">
                        <div className="mr-6 mb-2 sm:mb-0">
                            <p className="font-bold text-gray-700" style={{ fontSize: "18px" }}>Ngày tạo đơn</p>
                            <p className="text-sm" style={{ fontSize: "16px" }}>{formattedDate}</p>
                        </div>
                        <div className="mr-6 mb-2 sm:mb-0">
                            <p className="text-sm font-bold text-gray-700" style={{ fontSize: "18px" }}>Phương thức thanh toán</p>
                            <p className="text-sm" style={{ fontSize: "16px" }}>{getPaymentMethodText()}</p>
                        </div>
                        <div className="mb-2 sm:mb-0">
                            <p className="text-sm font-bold text-gray-700" style={{ fontSize: "18px" }}>Tổng tiền</p>
                            <p className="text-sm" style={{ fontSize: "16px" }}>{formatPrice(totalPrice)}₫</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded flex items-center ${getStatusStyle()}`}>
                            {getStatusIcon()} <span className="ml-2">{status}</span>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-48 mt-4">
                    {products.map((product, index) => {
                        const imageUrl = product.image && product.image.length > 0 ? `${backendUrl}${product.image[0].url}` : null;
                        console.log(`Product: ${product.name}, Image URL: ${imageUrl}`);

                        return (
                            <div key={index + product.name} className="mt-5 flex items-center">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded mr-4"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/chi-co-the-la-anh.png'; }} // Add a placeholder image path
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded mr-4">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900" style={{ fontSize: "20px" }}>{product.name}</h2>
                                    <p className="mt-1 text-xs text-gray-700" style={{ fontSize: "18px" }}>{product.category.name}</p>
                                </div>
                                <div className="flex items-center border-gray-100 ml-auto">
                                    x
                                    <input
                                        disabled={true}
                                        className="h-8 w-8 border bg-white text-center text-xs outline-none"
                                        style={{ fontSize: "18px" }}
                                        type="number"
                                        value={product.amount}
                                        min="1"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{formatPrice(product.price)}₫</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-500 border border-blue-500 bg-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white px-4 py-2 rounded transition-colors duration-300 mr-2"
                        style={{ border: '1px solid blue' }}
                    >
                        Xem chi tiết
                    </button>
                    {status !== 'Đã hủy' && status !== 'Đã hoàn thành' && (
                        <button
                            onClick={handleCancel}
                            className="text-red-500 border border-red-500 bg-white hover:bg-red-500 hover:text-white focus:bg-red-600 focus:text-white px-4 py-2 rounded transition-colors duration-300"
                            style={{ border: '1px solid red' }}
                        >
                            Hủy đơn
                        </button>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline" style={{ fontFamily: 'ALEGREYA-NORMAL' }}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900" style={{ fontSize: "20px" }}>CHI TIẾT ĐƠN HÀNG</h2>
                                <div className={`px-2 py-1 rounded flex items-center ${getStatusStyle()}`}>
                                    {getStatusIcon()} <span className="ml-2">{status}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>Ngày tạo đơn:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{formattedDate}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>Phương thức thanh toán:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{getPaymentMethodText()}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>Phương thức giao hàng:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{getDeliveryMethodText()}</p>
                                </div>
                            </div>


                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-700" style={{ fontSize: "18px" }}>Thông tin giao hàng</p>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Họ tên:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{customerName}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Số điện thoại:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{phone}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Địa chỉ:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{address}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Phường/Xã:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{ward}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Quận/Huyện:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{district}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "18px" }}>- Tỉnh/Thành phố:</p>
                                    <p className="text-sm" style={{ fontSize: "18px" }}>{city}</p>
                                </div>

                            </div>
                            <div className="mt-6">
                                <div className="flex">
                                    <p className="text-sm font-bold text-gray-700 mr-2" style={{ fontSize: "20px" }}>Tổng tiền:</p>
                                    <p className="text-sm " style={{ fontSize: "20px" }}>{formatPrice(totalPrice)}₫</p>
                                </div>
                            </div>
                            <div className="mt-4 overflow-y-auto max-h-48">
                                {products.map((product, index) => {
                                    const imageUrl = product.image && product.image.length > 0 ? `${backendUrl}${product.image[0].url}` : null;
                                    return (
                                        <div key={index + product.name} className="mt-5 flex items-center">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded mr-4"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/chi-co-the-la-anh.png'; }} // Add a placeholder image path
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded mr-4">
                                                    <span className="text-gray-500">No Image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900" >{product.name}</h2>
                                                <p className="mt-1 text-xs text-gray-700">{product.category.name}</p>
                                            </div>
                                            <div className="flex items-center border-gray-100 ml-auto">
                                                x
                                                <input
                                                    disabled={true}
                                                    className="h-8 w-8 border bg-white text-center text-xs outline-none " style={{ fontSize: "16px" }}
                                                    type="number"
                                                    value={product.amount}
                                                    min="1"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <p className="text-sm" style={{ fontSize: "16px" }}>{formatPrice(product.price)}₫</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-blue-500 border border-blue-500 bg-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white px-4 py-2 rounded transition-colors duration-300"
                                    style={{ border: '1px solid blue' }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default OrderItem;
