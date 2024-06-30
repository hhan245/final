import { useState } from 'react';
import { callAPI } from '../../utils/api-caller';

const OrderList = ({ orders, onOrderUpdate }) => {
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find(order => order.id === orderId);
      const prevStatus = order.attributes.status;

      if (prevStatus !== newStatus) {
        const productUpdates = order.attributes.products.map(async (product) => {
          try {
            const productRes = await callAPI(`/products/${product.productId}?fields=in_stock`, 'GET');
            const currentStock = productRes.data.data.attributes.in_stock;
            let newInStock = currentStock;

            // Handle status change logic
            if ((prevStatus === 'Đã xác nhận' || prevStatus === 'Đã hoàn thành') && newStatus === 'Đã hủy') {
              newInStock = parseInt(currentStock, 10) + parseInt(product.amount, 10);
            } else if (prevStatus === 'Đã hủy' && (newStatus === 'Đã xác nhận' || newStatus === 'Đã hoàn thành')) {
              newInStock = parseInt(currentStock, 10) - parseInt(product.amount, 10);
            }

            if (newInStock !== currentStock) {
              const payload = { data: { in_stock: newInStock } };
              console.log(`Payload for updating product ${product.productId}:`, JSON.stringify(payload, null, 2));

              const res = await callAPI(`/products/${product.productId}`, 'PUT', payload);
              console.log(`Product ${product.productId} updated successfully`, res.data);
              return res.data;
            }
          } catch (error) {
            console.error(`Error updating product ${product.productId}:`, error.response ? error.response.data : error);
            throw error;
          }
        });

        await Promise.all(productUpdates);
      }

      const orderPayload = { data: { status: newStatus } };
      console.log(`Payload for updating order ${orderId}:`, JSON.stringify(orderPayload, null, 2));

      const res = await callAPI(`/orders/${orderId}`, 'PUT', orderPayload);
      onOrderUpdate(res.data.data);
    } catch (error) {
      console.error('Error updating order status:', error.response ? error.response.data : error);
    }
  };

  const statusOptions = [
    { value: 'Đã xác nhận', label: 'Đã xác nhận' },
    { value: 'Đã hoàn thành', label: 'Đã hoàn thành' },
    { value: 'Đã hủy', label: 'Đã hủy' }
  ];

  return (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <h3>Order ID: {order.id}</h3>
          <p>Total Price: {order.attributes.totalPrice}</p>
          <p>Address: {order.attributes.address}</p>
          <p>Phone: {order.attributes.phone}</p>
          <p>Status: 
            <select
              value={order.attributes.status || 'Đã xác nhận'}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
