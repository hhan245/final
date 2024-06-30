import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import "./search-bar.css";
import "../../styles/style.css";
import { useState } from "react";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    try {
      const response = await fetch("http://localhost:1337/api/products?populate=*");
      const json = await response.json();
      const results = json.data.filter((product) => {
        const productName = product.attributes.name.toLowerCase();
        const brandName = product.attributes.brand.toLowerCase();
        return (
          value &&
          product &&
          (productName.includes(value.toLowerCase()) || brandName.includes(value.toLowerCase()))
        );
      });
      setResults(results);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Tìm kiếm..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
