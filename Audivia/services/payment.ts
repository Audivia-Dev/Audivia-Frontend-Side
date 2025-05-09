import apiClient from "@/utils/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const createPaymentIntent = async (returnUrl: string, cancelUrl: string, amount: number, description: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  const response = await apiClient.post(`/payment/vietqr`, {
    returnUrl,
    cancelUrl,
    amount,
    description,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

