import Link from "next/link";
import { useAppContext } from "./context";
import { callAPI } from "../utils/api-caller";
import { useState } from "react";
const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;

const ProductComponent = ({ brand, productName, price, imageUrl, id, oldPrice, isSale, isNew }) => {
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const {setShoppingCart} = useAppContext()
  const [showAlert, setShowAlert] = useState(false)

    const addToCart = async(productId)=>{
      try {
          const res = await callAPI("/add-to-shopping-cart", "POST", {productId, amount: 1})
          console.log(res)
          setShoppingCart(res.data)
          setShowAlert(true)
          setTimeout(()=>{ setShowAlert(false)}, 2000)
      } catch (error) {
          
      }
    }

    

  return (
    <div>
      <div className="relative group overflow-hidden hover:opacity-85" style={{ width: '100%', height: '100%', fontFamily: "ALEGREYA-NORMAL" }}>
        <Link href={"/products/" + id}>
          <div className="bg-white p-1 flex items-center justify-center" style={{ border: "1px solid black", height: '80%' }}>
            <img src={URL_SERVER + imageUrl} alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="px-2 py-1 text-center items-center" style={{ height: '20%' }}>
            <span className="text-gray-400 mr-1 uppercase text-xs" style={{ fontSize: '12px' }}>{brand}</span>
            <p className="text-sm text-black truncate block capitalize" style={{ fontSize: '15px' }}>{productName}</p>
            <div className="flex items-center justify-center w-full"> {/* Ensure full width and center content */}
              {isSale && oldPrice && (
                <div className="flex justify-center items-center w-full"> {/* Use justify-center for inner flex */}
                  <p className="text-sm text-gray-500 mr-2" style={{ textDecoration: 'line-through', fontSize: '15px' }}>{formatPrice(oldPrice)}₫</p>
                  <p className="text-sm text-black cursor-auto my-1" style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatPrice(price)}₫</p>
                </div>
              )}
              {!isSale && (
                <span className="text-sm text-black cursor-auto my-1" style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatPrice(price)}₫</span>
              )}
            </div>
          </div>

        </Link>
        <div onClick={(e) => { addToCart(id); e.stopPropagation() }} className="px-1 py-1 flex justify-between items-center opacity-0 group-hover:opacity-100 duration-300 ease-in-out">
          <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 focus:outline-none" style={{ fontSize: '10px' }}>
            THÊM VÀO GIỎ
          </button>
          <button className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-700 focus:outline-none" style={{ fontSize: '10px' }}>
            MUA NGAY
          </button>
        </div>
      </div>
      {
        showAlert &&
        <div className="fixed bottom-[1%] right-[1%] flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Success alert!</span>Thêm vào giỏ hàng thành công
          </div>
        </div>
      }

    </div>
    
  )
}

export default ProductComponent;
