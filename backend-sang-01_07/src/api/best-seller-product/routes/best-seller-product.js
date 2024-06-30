module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/best-seller-products',
      handler: 'best-seller-product.getBestSellers',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
