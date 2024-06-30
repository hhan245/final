"use client"
import ProductComponent from "../../components/product-component";
import { callAPI } from "../../utils/api-caller";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";


const pageSize = process.env.NEXT_PUBLIC_PAGE_SIZE
const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const searchParams = useSearchParams()
    const [pageCount, setPageCount] = useState(1)
    const router = useRouter();
    
    const page = searchParams.get('page') !== null ? +searchParams.get('page') : 1
    useEffect(() => {
        fetchData();
    }, [searchParams])
    const fetchData = async () => {
        try {
            const res = await callAPI(`/products?populate=*&pagination[pageSize]=${pageSize}&pagination[page]=${page}`, "GET")
            setProducts(res.data.data)
            setPageCount(res.data.meta.pagination.pageCount)
        } catch (error) {
            console.log(error)
        }
    }
    const prev = ()=>{
        router.push("/products?page=" + ((+page) - 1))
    }
    const next = ()=>{
        router.push("/products?page=" + ((+page) + 1))
    }

   
    return (
        <div>
            Trang xem danh sách sản phẩm
            
            <section id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5 pt-20">
                {
                    products.map((value, index) => {
                        return <ProductComponent
                            id={value.id}
                            key={index} productName={value.attributes.name}
                            price={value.attributes.price}
                            brand={value.attributes.brand}
                            imageUrl={value.attributes.image.data[0].attributes.url} />
                    })
                }
            </section>
            
            
            <div className="flex flex-col items-center">

                <div className="inline-flex mt-2 xs:mt-0">
                    <button disabled={+page <= 1} onClick={()=>prev()}  className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                        </svg>
                        Prev
                    </button>
                    <span className="ml-5 mr-5 font-bold"> {page}/ {pageCount}</span>
                    <button disabled={+page >= +pageCount} onClick={()=>next()} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                        <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    )
}
export default ProductsPage;