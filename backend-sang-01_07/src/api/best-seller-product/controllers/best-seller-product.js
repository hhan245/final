'use strict';

/**
 * A set of functions called "actions" for `best-seller-product`
 */

module.exports = {
  getBestSellers: async (ctx, next) => {
    try {
      const data = await strapi
        .service('api::best-seller-product.best-seller-product')
        .getBestSellers();
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
