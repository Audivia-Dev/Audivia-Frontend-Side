import apiClient from "@/utils/apiClient";

export const getTourTypes = async () => {
  try {
    const response = await apiClient.get('/tour-types');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại tour:', error);
    throw error;
  }
}
