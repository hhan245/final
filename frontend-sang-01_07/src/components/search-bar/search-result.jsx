import Link from "next/link";
import "./search-result.css";

export const SearchResult = ({ result }) => {
  const { id, attributes } = result;
  const { name, brand, image } = attributes;
  const imageUrl = image?.data?.[0]?.attributes?.formats?.thumbnail?.url || image?.data?.[0]?.attributes?.url;

  return (
    <Link href={`/products/${id}`} legacyBehavior>
      <a className="search-result">
        <img src={`http://localhost:1337${imageUrl}`} alt={name} className="result-image" />
        <div className="result-details">
          <p className="result-brand">{brand}</p>
          <p className="result-name">{name}</p>
        </div>
      </a>
    </Link>
  );
};
