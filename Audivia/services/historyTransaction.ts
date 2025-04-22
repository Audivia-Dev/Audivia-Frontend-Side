import apiClient from "@/utils/apiClient";

export const getHistoryTransactionByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(`/TransactionHistories/transaction/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history transaction:', error);
    throw error;
  }
}