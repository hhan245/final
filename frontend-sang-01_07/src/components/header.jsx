"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { callAPI } from "../utils/api-caller";
import { getUser, isLogined, setToken, setUser } from "../utils/helper";
import { useAppContext } from "./context";
import { SearchBar } from "../components/search-bar/search-bar";
import { SearchResultsList } from "../components/search-bar/search-result-list";

import { signOut, getSession } from "next-auth/react"

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [localUserMenu, setLocalUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  const [user, setUserState] = useState(null);
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { shoppingCart, setShoppingCart, isFetchedShoppingCart, setIsFetchedShoppingCart } = useAppContext();

  useEffect(() => {
    setLocalUser(getUser());
    fetchData();
    if (isLogined()) {
      fetchShoppingCart();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await callAPI("/categories", "GET");
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShoppingCart = async () => {
    if (!isFetchedShoppingCart) {
      try {
        const res = await callAPI("/my-shopping-cart", "GET");
        setShoppingCart(res.data);
        setIsFetchedShoppingCart(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logout = async () => {
    await signOut();
    setToken("");
    setLocalUser(null);
    setUser(null);
    router.replace("/");
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      const res = await callAPI(`/search?query=${searchQuery}`, "GET");
      setSearchResults(res.data.data);
    } catch (error) {
      console.log("Error searching for products:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800" style={{ fontFamily: "DFVN Lucky Skirt" }}>
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <img src="/images/logo-codar.png" className="mr-3 h-6 sm:h-9" alt="Codae Logo" />
          </Link>
          <div className="flex items-center lg:order-2">
            <div className="relative">
              <SearchBar setResults={setResults} />
              {results && results.length > 0 && <SearchResultsList results={results} />}
            </div>
            {!localUser ? (
              <Link href="/login" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                Đăng nhập
              </Link>
            ) : (
              <div className="relative">
                <button id="dropdownDefaultButton" onClick={() => setUserMenu(!userMenu)} data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                  {localUser.image ? (
                    <img src={localUser.image} className="w-6 h-6 rounded-full mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="w-6 h-6 rounded-full mr-2" />
                  )}
                </button>
                {userMenu && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                      <li>
                        <a href="my-profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Thông tin cá nhân
                        </a>
                      </li>
                      <li>
                        <Link href="/my-orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Đơn hàng
                        </Link>
                      </li>
                      <li>
                        <button onClick={() => logout()} href="/" className="block w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            {localUser && (
              <Link href="/shopping-cart" className="ml-10 relative">
                <FontAwesomeIcon icon={faShoppingCart} />
                <div className="bg-red-500 rounded-full text-white text-center absolute top-0 right-[-1em] text-xs px-1">{shoppingCart.length}</div>
              </Link>
            )}
          </div>
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link href="/" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/1" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Đĩa than
                </Link>
              </li>
              <li>
                <Link href="/category/2" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Đĩa CD
                </Link>
              </li>
              <li>
                <Link href="/category/3" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Băng Cassette
                </Link>
              </li>
              <li>
                <Link href="/best-seller-products" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Nổi bật
                </Link>
              </li>
              <li>
                <Link href="/sale-products" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
