import axios from "axios";
import { getToken } from "./helper";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL;

export const callAPI = async (endpoint, method, body, params) => {
  const token = getToken();
  try {
    const response = await axios({
      method: method,
      url: `${URL_SERVER}${endpoint}`,
      headers: { 
        'Authorization': `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json"
      },
      data: body,
      params
    });
    console.log(`API call success: ${method} ${endpoint}`, response.data);
    return response;
  } catch (error) {
    console.error(`Error in API call: ${method} ${endpoint}`, error.response ? error.response.data : error);
    throw error;
  }
};
