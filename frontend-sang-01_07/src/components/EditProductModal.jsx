import React, { useState, useEffect } from 'react';
import { callAPI } from '../utils/api-caller';
import { fileUploadService, fileDeleteService } from '../utils/file-service';

const EditProductModal = ({ product, onClose, onEdit }) => {
  const [name, setName] = useState(product.attributes.name);
  const [price, setPrice] = useState(product.attributes.price);
  const [inStock, setInStock] = useState(product.attributes.in_stock);
  const [description, setDescription] = useState(product.attributes.description);
  const [brand, setBrand] = useState(product.attributes.brand || '');
  const [genre, setGenre] = useState(product.attributes.genre || '');
  const [category, setCategory] = useState(product.attributes.category?.data?.id || '');
  const [image, setImage] = useState(null);
  const [isSale, setIsSale] = useState(product.attributes.isSale);
  const [isNew, setIsNew] = useState(product.attributes.isNew);
  const [oldPrice, setOldPrice] = useState(product.attributes.oldPrice);

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

  const handleEdit = async () => {
    try {
      let imageId = product.attributes.image?.data?.[0]?.id;
      if (image) {
        if (imageId) {
          await fileDeleteService(imageId);
        }
        const uploadResponse = await fileUploadService(image);
        imageId = uploadResponse[0].id;
      }

      const genreName = genres.find(g => g.id === genre)?.attributes.name;

      const updatedProduct = {
        name,
        price,
        in_stock: inStock,
        description,
        brand,
        genre: genreName,
        category: category ? parseInt(category) : null,
        image: imageId ? [{ id: imageId }] : [],
        isSale,
        isNew,
        oldPrice
      };

      const res = await callAPI(`/products/${product.id}`, 'PUT', { data: updatedProduct });
      onEdit(res.data);
      onClose();
    } catch (error) {
      console.error('Error editing product:', error.response ? error.response.data : error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Product</h2>
        {console.log('EditProductModal rendered with product:', product)}
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
        <button onClick={handleEdit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditProductModal;
