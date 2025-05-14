import apiClient from "@/utils/apiClient";

export const getTop3Tours= async () => {
  try {
    const response = await apiClient.get('/tours?Sort=ratingDesc&Top=3');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
}
export const getTourById = async (tourId: string) => {
  try{
    const response = await apiClient.get(`/tours/${tourId}`);
    return response.data;
  }catch(error){
    console.error('Lỗi khi lấy tour:', error);
    throw error;
  }
}
export const getToursByTypeId = async (typeId: string) => {
  try {
    const response = await apiClient.get(`/tours?TourTypeId=${typeId}&PageSize=3`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour:', error);
    throw error;
  }
}
export const getTourAudioById = async () => {
  try {
    const response = await apiClient.get(`/checkpoint-audios`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour audio:', error);
    throw error;
  }
}


