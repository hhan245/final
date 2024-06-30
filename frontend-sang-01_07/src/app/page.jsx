"use client";
import Link from "next/link";
import Footer from "../components/footer";
import { useEffect, useState, useRef } from "react";
import "./../styles/style.css";
import Header from "../components/header";
import ProductComponent from "../components/product-component";
import { callAPI } from "../utils/api-caller"; // Import the API caller function

const Home = () => {
  const images = [
    "/images/banner/slide_banner_1.png",
    "/images/banner/slide_banner_2.png",
    "/images/banner/slide_banner_3.png"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [bestSellerProducts, setBestSellerProducts] = useState([]); // State to hold best-seller products
  const [newProducts, setNewProducts]= useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading

  const productListRef1 = useRef(null);
  const productListRef2 = useRef(null);

  const nextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const scrollLeft1 = () => {
    productListRef1.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight1 = () => {
    productListRef1.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  const scrollLeft2 = () => {
    productListRef2.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight2 = () => {
    productListRef2.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch best-seller products on component mount
  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const res = await callAPI("/best-seller-products", "GET");
        setBestSellerProducts(res.data || []); // Assuming the response data is an array of products
      } catch (error) {
        console.error("Error fetching best-seller products:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchBestSellerProducts();
  }, []);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await callAPI("/products?populate=*&filters[isNew][$eq]=true", "GET");
        setNewProducts(res.data.data || []); // Assuming the response data is an array of products
      } catch (error) {
        console.error("Error fetching best-seller products:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchNewProducts();
  }, []);



  return (
    <div>
      <div className="container mx-auto px-0 pt-20" style={{ maxWidth: '1280px' }}>
        <Header />
        <section>
          <div className="relative banner">
            <img src={images[currentImage]} className="w-full" alt="Banner" />
            <div className="absolute inset-0 flex justify-between items-center banner-nav">
              <button onClick={prevImage} className="banner-arrow opacity-0 hover:opacity-100 left-arrow" aria-label="Previous Image"></button>
              <button onClick={nextImage} className="banner-arrow opacity-0 hover:opacity-100 right-arrow" aria-label="Next Image"></button>
            </div>
          </div>
        </section>

        <section>
          <div className="image-grid">
            <div className="grid-item">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_1.png?v=198" alt="Description of Image 1" />
            </div>
            <div className="grid-item">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_2.png?v=198" alt="Description of Image 2" />
            </div>
            <div className="grid-item">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_3.png?v=198" alt="Description of Image 3" />
            </div>
          </div>
        </section>

        <section className="new-arrivals">
          <h2>SẢN PHẨM MỚI</h2>
          <div className="relative">
            <button onClick={scrollLeft1} className="absolute left-0 z-10 bg-gray-300 p-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>Left</button>
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide" ref={productListRef1} style={{ display: 'flex', gap: '16px', padding: '0 50px' }}>
              {loading && <div>Loading...</div>}
              {!loading && newProducts.length === 0 && <div>No new products available.</div>}
              {
                !loading && newProducts.length > 0 && newProducts.map((product, index) => (
                  <div key={index} style={{ minWidth: '200px', maxWidth: '200px' }}>
                    <ProductComponent
                      id={product.id}
                      key={index}
                      productName={product.attributes.name}
                      price={product.attributes.price}
                      oldPrice={product.attributes.oldPrice} // Assuming oldPrice is directly under attributes
                      isSale={product.attributes.isSale}
                      isNew={product.attributes.isNew} // Assuming isSale is directly under attributes
                      brand={product.attributes.brand}
                      imageUrl={product.attributes.image.data[0].attributes.url}
                    />
                  </div>
                ))
              }
            </div>
            <button onClick={scrollRight1} className="absolute right-0 z-10 bg-gray-300 p-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>Right</button>
          </div>
        </section>

        <section className="best-seller-products">
          <h2>ĐANG THỊNH HÀNH</h2>
          <div className="relative">
            <button onClick={scrollLeft2} className="absolute left-0 z-10 bg-gray-300 p-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>Left</button>
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide" ref={productListRef2} style={{ display: 'flex', gap: '16px', padding: '0 50px' }}>
              {loading && <div>Loading...</div>}
              {!loading && bestSellerProducts.length === 0 && <div>No best seller products available.</div>}
              {!loading && bestSellerProducts.length > 0 && bestSellerProducts.map((product, index) => (
                <div key={index} style={{ minWidth: '200px', maxWidth: '200px' }}>
                  <ProductComponent
                    id={product.id}
                    brand={product.brand}
                    productName={product.name}
                    price={product.price}
                    imageUrl={product.image[0].formats?.small?.url || product.image[0].url}
                  />
                </div>
              ))}
            </div>
            <button onClick={scrollRight2} className="absolute right-0 z-10 bg-gray-300 p-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>Right</button>
          </div>
        </section>
{/* 
        <section>
          <div className="image-grid2 ">
            <div className="grid-item2">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_1v2.png?v=233" alt="Description of Image 1" />
            </div>
            <div className="grid-item2">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_2v2.png?v=233" alt="Description of Image 2" />
            </div>
            <div className="grid-item2">
              <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_3_image_3v2.png?v=233" alt="Description of Image 3" />
            </div>
          </div>
        </section>
        */}

        <section>
          <div>
            <img src="https://theme.hstatic.net/1000304920/1001035765/14/banner_1_image.jpg?v=201" alt="Promotional Banner" />
          </div>
        </section>

        <section className="about-us-section">
          <div className="container mx-auto px-4 py-12">
            <h2 className="section-title">CÂU CHUYỆN CỦA CHÚNG TÔI</h2>
            <div className="about-us-content">
              <div className="content-block">
                <div className="about-us-images">
                  <img src="/images/about-us-1.jpg" alt="Busy office scene" />
                </div>
                <div className="about-us-text">
                  <p>Codae Records, nơi các đồng âm cùng nhau khám phá những giai điệu không bao giờ lỗi thời. Được thành lập vào năm 2024, chúng tôi chuyên cung cấp Đĩa Than, CD, và Băng Cassette, tại đây chúng tôi mang đến những trải nghiệm âm nhạc không giới hạn từ các bản phát hành cổ điển đến những sản phẩm mới nhất.</p>
                  <div style={{ height: "20px" }}></div>
                  <p>Với sự đam mê sâu sắc với âm nhạc và mong muốn duy trì nghệ thuật nghe nhạc truyền thống, Codae Records không chỉ là một cửa hàng âm nhạc mà còn là điểm đến cho cộng đồng những người yêu âm nhạc. Chúng tôi tự hào tạo ra một không gian nơi mọi người có thể khám phá, chia sẻ và tận hưởng âm nhạc một cách đích thực.
                  </p>
                </div>
              </div>
              <div className="content-block">
                <div className="quote-block">
                  <p>Music gives a soul to the universe, </p>
                  <p>wings to the mind, </p>
                  <p>flight to the imagination,</p>
                  <p>and life to everything.</p>
                  <span className="quote-author"> ────Plato, Classical Athenian Philosopher</span>
                </div>

                <div className="about-us-images pl-10">
                  <img src="/images/about-us-2.jpg" alt="Person planning on a wall" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
