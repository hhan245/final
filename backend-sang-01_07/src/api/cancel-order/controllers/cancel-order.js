'use strict';

/**
 * A set of functions called "actions" for `cancel-order`
 */

module.exports = {
  cancel: async (ctx, next) => {
    try {
      const { orderId } = ctx.params;
      const data = await strapi
        .service('api::cancel-order.cancel-order')
        .cancel(orderId);
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
