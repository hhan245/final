import React, { useState, useEffect } from 'react';
import { callAPI } from '../utils/api-caller';
import { fileUploadService } from '../utils/file-service';

const AddProductModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [genre, setGenre] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [isSale, setIsSale] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [oldPrice, setOldPrice] = useState('');

  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchRelations();
  }, []);

  const fetchRelations = async () => {
    try {
      const genresResponse = await callAPI('/genres', 'GET');
      const categoriesResponse = await callAPI('/categories', 'GET');
      setGenres(genresResponse.data.data);
      setCategories(categoriesResponse.data.data);
    } catch (error) {
      console.error('Error fetching relations:', error);
    }
  };

  const handleAdd = async () => {
    try {
      // Check if a product with the same name already exists
      const existingProducts = await callAPI(`/products?filters[name][$eq]=${name}`, 'GET');
      if (existingProducts.data.data.length > 0) {
        alert('A product with this name already exists. Please use a different name.');
        return;
      }

      let imageId = null;
      if (image) {
        const uploadResponse = await fileUploadService(image);
        imageId = uploadResponse[0].id;
      }

      const genreName = genres.find(g => g.id === genre)?.attributes.name;

      const newProduct = {
        name,
        price: parseFloat(price),  // Ensure price is a number
        in_stock: parseInt(inStock, 10),  // Ensure in_stock is a number
        description,
        brand,
        genre: genreName,
        category,
        image: imageId ? imageId : null,
        isSale: !!isSale,  // Ensure isSale is a boolean
        isNew: !!isNew,  // Ensure isNew is a boolean
        oldPrice: oldPrice ? parseFloat(oldPrice) : null  // Ensure oldPrice is a number or null
      };

      console.log('Payload:', newProduct); // Log the payload

      const res = await callAPI('/products', 'POST', { data: newProduct });
      onAdd(res.data);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Product</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          In Stock:
          <input type="number" value={inStock} onChange={(e) => setInStock(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Brand:
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label>
          Genre:
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.attributes.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.attributes.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Is Sale:
          <input type="checkbox" checked={isSale} onChange={(e) => setIsSale(e.target.checked)} />
        </label>
        <label>
          Is New:
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
        </label>
        <label>
          Old Price:
          <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
        </label>
        <label>
          Image:
          <input type="file" onChange={handleImageChange} />
        </label>
        <button onClick={handleAdd}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProductModal;
