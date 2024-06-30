module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cancel-order/:orderId',
      handler: 'cancel-order.cancel',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
