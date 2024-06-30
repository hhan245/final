import { useState } from 'react';
import { callAPI } from '../../utils/api-caller';
import EditProductModal from '../EditProductModal';

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA;

const ProductList = ({ products, onProductDelete, onProductEdit, onEditClick }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    onEditClick(product);
  };

  const handleDelete = async (productId) => {
    try {
      await callAPI(`/products/${productId}`, 'DELETE');
      onProductDelete(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product.id} className="product-item">
          {product.attributes?.image?.data?.length > 0 && (
            <img
              src={URL_SERVER + product.attributes.image.data[0].attributes.url}
              alt={product.attributes.name}
            />
          )}
          <h3>{product.attributes?.name}</h3>
          <p>Price: {product.attributes?.price}</p>
          <p>In Stock: {product.attributes?.in_stock}</p>
          <p>Category: {product.attributes?.category?.data?.attributes?.name}</p>
          <p>Genre: {product.attributes?.genre}</p>
          <p>Brand: {product.attributes?.brand}</p>
          <p>Old Price: {product.attributes?.oldPrice}</p>
          <p>Is Sale: {product.attributes?.isSale ? 'Yes' : 'No'}</p>
          <p>Is New: {product.attributes?.isNew ? 'Yes' : 'No'}</p>
          <button onClick={() => handleEditClick(product)}>Edit</button>
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={onProductEdit}
        />
      )}
    </div>
  );
};

export default ProductList;
