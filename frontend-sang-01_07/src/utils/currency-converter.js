import axios from 'axios';


const API_URL = `https://v6.exchangerate-api.com/v6/4751780b11dcb344487269ef/pair/VND/USD`;

export const convertVNDToUSD = async (amountInVND) => {
  try {
    const response = await axios.get(`${API_URL}/${amountInVND}`);
    const { conversion_rate } = response.data;
    const amountInUSD = amountInVND * conversion_rate;
    return parseFloat(amountInUSD.toFixed(2)); // Ensure the returned value is a number
  } catch (error) {
    console.error("Error converting currency: ", error);
    return null;
  }
};
