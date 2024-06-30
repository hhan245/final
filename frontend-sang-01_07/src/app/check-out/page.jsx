"use client";

import { useAppContext } from "../../components/context";
import ShoppingCartItem from "../../components/shopping-cart-item";
import { callAPI } from "../../utils/api-caller";
import { convertVNDToUSD } from "../../utils/currency-converter";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;

const CheckOutPage = () => {
  const { shoppingCart, setShoppingCart } = useAppContext();
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState(""); // Add name state
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const router = useRouter();
  

  useEffect(() => {
    calcTotalPrice();
  }, [shoppingCart]);

  const calcTotalPrice = () => {
    let sum = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      sum += +shoppingCart[i].price * +shoppingCart[i].amount;
    }
    setTotalPrice(sum);
  };

  const add = async (productId) => {
    try {
      const res = await callAPI("/add-to-shopping-cart", "POST", {
        productId,
        amount: 1,
      });
      setShoppingCart(res.data);
      calcTotalPrice();
    } catch (error) {
      console.error(error);
    }
  };

  const decrease = async (productId) => {
    try {
      const res = await callAPI("/add-to-shopping-cart", "POST", {
        productId,
        amount: -1,
      });
      setShoppingCart(res.data);
      calcTotalPrice();
    } catch (error) {
      console.error(error);
    }
  };

  const remove = async (productId, amount) => {
    try {
      const res = await callAPI("/add-to-shopping-cart", "POST", {
        productId,
        amount,
      });
      setShoppingCart(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    const missingFields = [];
    if (!customerName) missingFields.push("Họ tên");
    if (!address) missingFields.push("Địa chỉ");
    if (!phone) missingFields.push("Số điện thoại");
    if (!city) missingFields.push("Tỉnh/ Thành phố");
    if (!district) missingFields.push("Quận/ Huyện");
    if (!ward) missingFields.push("Phường/ Xã");
    return missingFields;
  };

  const onCheckout = async () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      alert(`Để tiếp tục bạn cần nhập: ${missingFields.join(", ")}`);
      return;
    }

    if (totalPrice === 0) {
      alert("Bạn cần thêm sản phẩm để tiếp tục thanh toán");
      return;
    }

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
      setShoppingCart([]);
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const citis = document.getElementById("city");
    const districts = document.getElementById("district");
    const wards = document.getElementById("ward");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        renderCity(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const renderCity = (data) => {
      for (const x of data) {
        const opt = document.createElement("option");
        opt.value = x.Name;
        opt.text = x.Name;
        opt.setAttribute("data-id", x.Id);
        citis.options.add(opt);
      }

      citis.onchange = function () {
        districts.length = 1;
        wards.length = 1;
        setCity(this.value);
        if (this.options[this.selectedIndex].dataset.id !== "") {
          const result = data.filter(
            (n) => n.Id === this.options[this.selectedIndex].dataset.id
          );

          for (const k of result[0].Districts) {
            const opt = document.createElement("option");
            opt.value = k.Name;
            opt.text = k.Name;
            opt.setAttribute("data-id", k.Id);
            districts.options.add(opt);
          }
        }
      };

      districts.onchange = function () {
        wards.length = 1;
        setDistrict(this.value);
        const dataCity = data.filter(
          (n) => n.Id === citis.options[citis.selectedIndex].dataset.id
        );
        if (this.options[this.selectedIndex].dataset.id !== "") {
          const dataWards = dataCity[0].Districts.filter(
            (n) => n.Id === this.options[this.selectedIndex].dataset.id
          )[0].Wards;

          for (const w of dataWards) {
            const opt = document.createElement("option");
            opt.value = w.Name;
            opt.text = w.Name;
            opt.setAttribute("data-id", w.Id);
            wards.options.add(opt);
          }
        }
      };

      wards.onchange = function () {
        setWard(this.value);
      };
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen bg-white-100 pt-20">
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="relative mt-6 h-full bg-white p-6 md:mt-0 md:w-2/3">
          {/* THÔNG TIN GIAO HÀNG */}
          <div className="mb-10">
            <div className="w-full h-12 bg-gray-200 flex items-center">
              <h1 className="ml-4 text-left font-bold relative z-10" style={{ fontSize: "20px" }}>
                THÔNG TIN GIAO HÀNG
              </h1>
            </div>
            <div className="mt-4">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Họ tên
                </label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Họ tên"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Số điện thoại"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Địa chỉ"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">
                  Tỉnh/ Thành phố
                </label>
                <select
                  id="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Tỉnh/ Thành phố
                  </option>
                </select>
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900">
                    Quận/ Huyện
                  </label>
                  <select
                    id="district"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Quận/ Huyện
                    </option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label htmlFor="ward" className="block mb-2 text-sm font-medium text-gray-900">
                    Phường/ Xã
                  </label>
                  <select
                    id="ward"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Phường/ Xã
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PHƯƠNG THỨC GIAO HÀNG */}
          <div className="mb-10">
            <div className="w-full h-12 bg-gray-200 flex items-center">
              <h2 className="ml-4 text-left font-bold relative z-10" style={{ fontSize: "20px" }}>
                PHƯƠNG THỨC GIAO HÀNG
              </h2>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <input
                  id="delivery-standard"
                  type="radio"
                  value="standard"
                  checked={deliveryMethod === "standard"}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  required
                />
                <label htmlFor="delivery-standard" className="ml-2 text-sm font-medium text-gray-900">
                  Tốc độ tiêu chuẩn (từ 2 - 5 ngày làm việc)
                </label>
                <p className="ml-auto text-sm text-gray-500">0 VNĐ</p>
              </div>
            </div>
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="mb-10">
            <div className="w-full h-12 bg-gray-200 flex items-center">
              <h2 className="ml-4 text-left font-bold relative z-10" style={{ fontSize: "20px" }}>
                PHƯƠNG THỨC THANH TOÁN
              </h2>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <input
                  id="payment-cod"
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  required
                />
                <label htmlFor="payment-cod" className="ml-2 text-sm font-medium text-gray-900">
                  Thanh toán trực tiếp khi nhận hàng
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="payment-online"
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  required
                />
                <label htmlFor="payment-online" className="ml-2 text-sm font-medium text-gray-900">
                  Thanh toán bằng Paypal
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <h2 className="text-xl font-bold mb-4">ĐƠN HÀNG</h2>
          <div className="flex justify-between mb-4">
            <p className="text-lg font-bold">Total</p>
            <div>
              <p className="mb-1 text-lg font-bold">{formatPrice(totalPrice)}</p>
              <p className="text-sm text-gray-700">including VAT</p>
            </div>
          </div>
          {paymentMethod === "cod" ? (
            <button
              onClick={() => {
                const missingFields = validateForm();
                if (missingFields.length > 0) {
                  alert(`Để tiếp tục bạn cần nhập: ${missingFields.join(", ")}`);
                  return;
                }
                onCheckout();
              }}
              className="w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
            >
              Check out
            </button>
          ) : (
            <button
              onClick={async () => {
                const missingFields = validateForm();
                if (missingFields.length > 0) {
                  alert(`Để tiếp tục bạn cần nhập: ${missingFields.join(", ")}`);
                  return;
                }

                const amountInUSD = await convertVNDToUSD(totalPrice);
                console.log(`Converted amount: ${amountInUSD}`); // Logging the converted amount
                if (!isNaN(amountInUSD)) {
                  router.push(`/online-check-out?amount=${amountInUSD}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&ward=${encodeURIComponent(ward)}&deliveryMethod=${encodeURIComponent(deliveryMethod)}&paymentMethod=${encodeURIComponent(paymentMethod)}`);
                } else {
                  alert("Conversion error. Please try again.");
                }
              }}
              className="w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
            >
              Tiếp tục Thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;