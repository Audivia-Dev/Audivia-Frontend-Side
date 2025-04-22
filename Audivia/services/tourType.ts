import apiClient from "@/utils/apiClient";

export const getTourTypes = async () => {
  try {
    const response = await apiClient.get('/TourType');
    return response.data;
  } catch (error) {
    console.error('Error fetching tour types:', error);
    throw error;
  }
}
