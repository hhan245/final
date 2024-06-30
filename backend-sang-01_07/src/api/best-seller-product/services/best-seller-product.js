'use strict';

/**
 * best-seller-product service
 */

const getBestSellerProducts = (products) => {
  // Sort products by quantity sold in descending order
  products.sort((a, b) => b.quantitySold - a.quantitySold);

  // Return the top 10 products
  return products.slice(0, 10);
};

module.exports = () => ({
  getBestSellers: async () => {
    try {
      // Calculate the date 30 days ago from today
      const date30DaysAgo = new Date();
      date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

      // Fetch all orders from the last 30 days
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { createdAt: { $gte: date30DaysAgo.toISOString() } },
        populate: { products: true },
      });

      // Create a map to hold product sales data
      const productSalesMap = {};

      // Aggregate total quantity sold for each product
      orders.forEach(order => {
        order.products.forEach(product => {
          const productId = product.productId;
          const amount = product.amount;

          if (!productSalesMap[productId]) {
            productSalesMap[productId] = { productId, quantitySold: 0 };
          }

          productSalesMap[productId].quantitySold += amount;
        });
      });

      // Convert the map to an array
      const productSales = Object.values(productSalesMap);

      // Get the top 10 best-seller products
      const bestSellers = getBestSellerProducts(productSales);

      // Fetch the full product details for the top 10 products
      const bestSellerDetails = await Promise.all(
        bestSellers.map(async bestSeller => {
          const productDetails = await strapi.entityService.findOne('api::product.product', bestSeller.productId, {
            populate: { category: true, image: true },
          });
          return {
            ...productDetails,
            quantitySold: bestSeller.quantitySold,
          };
        })
      );

      return bestSellerDetails;
    } catch (error) {
      console.log(error);
      return { error: "An error occurred while fetching the best-seller products" };
    }
  }
});
