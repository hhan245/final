'use strict';

const calculateMonthlyRevenue = (orders) => {
  const monthlyRevenue = {};

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const month = orderDate.toLocaleString('default', { month: 'long' });
    const year = orderDate.getFullYear();
    const monthYear = `${month} ${year}`;

    if (!monthlyRevenue[monthYear]) {
      monthlyRevenue[monthYear] = 0;
    }

    monthlyRevenue[monthYear] += parseFloat(order.totalPrice);
  });

  return Object.keys(monthlyRevenue).map(key => ({
    month: key,
    revenue: monthlyRevenue[key],
  }));
};

module.exports = () => ({
  getRevenue: async () => {
    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        fields: ['totalPrice', 'createdAt', 'status'],
        filters: { 
          $or: [
            { status: 'Đã hoàn thành' },
            { status: 'Đã xác nhận' }
          ] 
        },
      });
      const revenueData = calculateMonthlyRevenue(orders);
      return revenueData;
    } catch (error) {
      console.error('Error calculating revenue:', error);
      return { error: 'An error occurred while calculating revenue' };
    }
  }
});
