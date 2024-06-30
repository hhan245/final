'use strict';

/**
 * A set of functions called "actions" for `my-shopping-cart`
 */

module.exports = {
  getMyShoppingCart: async (ctx, next) => {
    try {
      const shoppingcart = ctx.state.user.shoppingcart || [];
      console.log("User Shopping Cart:", shoppingcart); // Debugging statement
      const data = await strapi
        .service("api::my-shopping-cart.my-shopping-cart")
        .getMyShoppingCart(shoppingcart);
      console.log("Service Returned Data:", data); // Debugging statement
      ctx.body = data;
    } catch (err) {
      console.log("Error in getMyShoppingCart:", err); // Debugging statement
      ctx.body = { error: err.message };
    }
  }
};
