"use client";

import ProductComponent from "../../components/product-component";
import { callAPI } from "../../utils/api-caller";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Header from '../../components/header';
import Footer from '../../components/footer';




const BestSellerProductsPage = () => {
    
    
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [sortOption, setSortOption] = useState('');
    
    const [showGenres, setShowGenres] = useState(false);
    const [showBrands, setShowBrands] = useState(false);
    const [showPrices, setShowPrices] = useState(false);

    const toggleSection = (section) => {
        if (section === 'genres') setShowGenres(!showGenres);
        if (section === 'brands') setShowBrands(!showBrands);
        if (section === 'prices') setShowPrices(!showPrices);
    };
    useEffect(() => {
        fetchProducts();
        fetchGenres();
        fetchBrands();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, selectedGenres, selectedBrands, priceRange, sortOption]);

    const fetchProducts = async () => {
        try {
            const queryURL = `/best-seller-products?populate=*`;
            const response = await callAPI(queryURL, "GET");
            setProducts(response.data);
            setFilteredProducts(response.data); // Initialize with all products
            
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    
    const fetchGenres = async () => {
        // This should fetch genres from your API
        const response = await callAPI("/genres", "GET");
        setGenres(response.data.data);
    };

    const fetchBrands = async () => {
        // This should fetch brands from your API
        const response = await callAPI("/brands", "GET");
        setBrands(response.data.data);
    };

    const applyFilters = () => {
        let result = products;

        // Filter by genre
        if (selectedGenres.length > 0) {
            result = result.filter(product => selectedGenres.includes(product.genre));
        }

        // Filter by brand
        if (selectedBrands.length > 0) {
            result = result.filter(product => selectedBrands.includes(product.brand));
        }

        // Filter by price range
        result = result.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sorting
        if (sortOption === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    };
    const handleGenreChange = (event) => {
        const value = event.target.value;
        const checked = event.target.checked;
        setSelectedGenres(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };
    
    // Function to handle changes in selected brands
    const handleBrandChange = (event) => {
        const value = event.target.value;
        const checked = event.target.checked;
        setSelectedBrands(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };
    
    // Function to handle changes in price range from the slider
    const handlePriceChange = (value) => {
        setPriceRange(value);
    };
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


    
    return (
        <div>
            <div className="container mx-auto px-0 pt-20" style={{ maxWidth: '1280px', fontFamily: "ALEGREYA-NORMAL" }}>
                <Header />
                <div className="flex justify-between flex-wrap">
                    
                        <img src="/images/banner/trending-banner.jpg"alt="Category Banner" />
                    
                    {/* Left side - Filter Section */}
                    <div className="w-1/5 pt-4 pr-4 pl-1">
                        <div>
                            <label onClick={() => toggleSection('genres')}>
                                Thể loại <span>{showGenres ? '▲' : '▼'}</span>
                            </label>
                            {showGenres && (
                                <div>
                                    {genres.map((genre) => (
                                        <div className="inputItem" key={genre.id}>
                                            <input
                                                type="checkbox"
                                                id={`genre-${genre.id}`}
                                                value={genre.attributes.name}
                                                onChange={handleGenreChange}
                                            />
                                            <label htmlFor={`genre-${genre.id}`}>{genre.attributes.name}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label onClick={() => toggleSection('brands')}>
                                Nghệ sĩ <span>{showBrands ? '▲' : '▼'}</span>
                            </label>
                            {showBrands && (
                                <div>
                                    {brands.map((brand) => (
                                        <div className="inputItem" key={brand.id}>
                                            <input
                                                type="checkbox"
                                                id={`brand-${brand.id}`}
                                                value={brand.attributes.name}
                                                onChange={handleBrandChange}
                                            />
                                            <label htmlFor={`brand-${brand.id}`}>{brand.attributes.name}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label onClick={() => toggleSection('prices')}>
                                Giá <span>{showPrices ? '▲' : '▼'}</span>
                            </label>
                            {showPrices && (
                                <div>
                                    <Slider
                                        range
                                        min={0}
                                        max={2000000}
                                        step={100000}
                                        value={priceRange}
                                        onChange={handlePriceChange}
                                        trackStyle={[{ backgroundColor: 'green' }]}
                                        handleStyle={[{ borderColor: 'green' }, { borderColor: 'green' }]}
                                        railStyle={{ backgroundColor: 'lightgrey' }}
                                    />
                                    <div>
                                        Từ {formatPrice(priceRange[0])}₫ đến {formatPrice(priceRange[1])}₫
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right side - Products Section */}
                    <div className="w-3/4 pt-4 pr-1 pl-4" >
                        <div className="flex justify-between items-center mb-4 ">
                            <h2 className="text-lg ">Sắp xếp theo</h2>


                            <select className="border border-gray-300 rounded px-2 py-1 " onChange={handleSortChange} >
                                <option value="price-desc">Tất cả</option>
                                <option value="price-asc">Giá: Tăng dần</option>
                                <option value="price-desc">Giá: Giảm dần</option>
                            </select>
                        </div>

                        <div className="justify-between items-center grid grid-cols-5 gap-3 ">
                            {
                                filteredProducts.map((value, index) => {
                                    return <ProductComponent
                                        id={value.id}
                                        key={index}
                                        productName={value.name}
                                        price={value.price}
                                        oldPrice = {value.oldPrice}
                                        isSale = {value.isSale}
                                        brand={value.brand}
                                        imageUrl={value.image[0].url}
                                    />
                                })
                            }
                            {
                                products.length === 0 && <div>Loading...</div>
                            }

                        </div>
                       
                    </div>


                </div>


            </div>
            <Footer />

        </div>
    );
};

export default BestSellerProductsPage;
