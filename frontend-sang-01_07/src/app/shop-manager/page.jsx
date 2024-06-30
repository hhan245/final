"use client";
import { useState, useEffect } from 'react';
import ProductList from '../../components/productlist/product-list';
import OrderList from '../../components/orderlist/order-list';
import AddProductModal from '../../components/AddProductModal';
import EditProductModal from '../../components/EditProductModal'; // Import the EditProductModal
import RevenueChart from '../../components/revenuechart/revenue-chart';
import { callAPI } from '../../utils/api-caller';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ShopManager = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRevenue();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await callAPI('/products?populate=*', 'GET');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await callAPI('/orders?populate=*', 'GET');
      setOrders(res.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await callAPI('/get-revenue', 'GET');
      setRevenue(res.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  const handleProductAdd = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleProductEdit = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleProductDelete = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(
      orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  return (
    <div className="shop-manager-page pt-20">
      <h1>Shop Manager</h1>
      <button onClick={() => setIsAddModalOpen(true)}>Add Product</button>
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleProductAdd}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleProductEdit}
        />
      )}
      <h2>Products</h2>
      <ProductList
        products={products}
        onProductDelete={handleProductDelete}
        onProductEdit={handleProductEdit}
        onEditClick={handleEditClick} // Pass the handleEditClick function
      />
      <h2>Orders</h2>
      <OrderList orders={orders} onOrderUpdate={handleOrderUpdate} />
      <h2>Revenue</h2>
      <RevenueChart revenueData={revenue} />
    </div>
  );
};

export default ShopManager;
