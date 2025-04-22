import apiClient from "@/utils/apiClient";

export const getTours = async () => {
  try {
    const response = await apiClient.get('/Tours');
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
}