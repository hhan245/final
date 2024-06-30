'use strict';

/**
 * cancel-order service
 */

module.exports = () => ({
  cancel: async (orderId) => {
    try {
      // Fetch the order by ID
      const order = await strapi.entityService.findOne('api::order.order', orderId, {
        populate: { products: true },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Update the stock for each product in the order
      for (const item of order.products) {
        const product = await strapi.entityService.findOne('api::product.product', item.productId);
        await strapi.entityService.update('api::product.product', item.productId, {
          data: {
            in_stock: product.in_stock + item.amount,
          },
        });
      }

      // Update the order status to "Đã hủy"
      await strapi.entityService.update('api::order.order', orderId, {
        data: {
          status: 'Đã hủy',
        },
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred while cancelling the order' };
    }
  },
});
