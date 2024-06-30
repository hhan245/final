import { useEffect, useState } from 'react';
import { callAPI } from '../../utils/api-caller';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const RevenueChart = ({ revenueData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  });

  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (revenueData && revenueData.length > 0) {
      const labels = revenueData.map((data) => data.month);
      const data = revenueData.map((data) => data.revenue);

      const total = data.reduce((acc, cur) => acc + cur, 0);
      setTotalRevenue(total);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: data,
            backgroundColor: 'rgba(75,192,192,0.6)',
          },
        ],
      });
    }
  }, [revenueData]);

  if (!revenueData || revenueData.length === 0) {
    return <p>No revenue data available</p>;
  }

  return (
    <div>
      <h2>Total Revenue: {totalRevenue}</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default RevenueChart;
