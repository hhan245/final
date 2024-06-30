'use strict';

/**
 * my-shopping-cart service
 */

const cleanShoppingCart = (shoppingcart) => {
  return shoppingcart.filter(item => item.productId && item.amount);
};

module.exports = () => ({
  getMyShoppingCart: async (shoppingcart) => {
    try {
      // Clean the shopping cart to remove any malformed entries
      const validItems = cleanShoppingCart(shoppingcart);
      
      for (let i = 0; i < validItems.length; i++) {
        const amount = validItems[i].amount;
        const product = await strapi.entityService.findOne('api::product.product', validItems[i].productId, {
          populate: { category: true, image: true },
        });
        validItems[i] = { ...product, amount };
      }
      
      console.log("Processed Shopping Cart:", validItems); // Debugging statement
      return validItems;
    } catch (error) {
      console.log("Error in getMyShoppingCart service:", error); // Debugging statement
      throw error;
    }
  },
});
