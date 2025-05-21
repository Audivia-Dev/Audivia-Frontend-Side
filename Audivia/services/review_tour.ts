import apiClient from "@/utils/apiClient"

export const writeReviewTour = async (
    title: string,
    rating: number,
    content: string,
    tourId: string,
    createdBy: string,
  ) => {
  try {
    const imageUrl = 'string'
    const response = await apiClient.post('/tour-reviews', {
      title, imageUrl, content, rating, tourId, createdBy
    })
    console.log('TEST NÈ', response.data)
    return response.data
  } catch (error) {
    console.error('Lỗi tạo tour đánh giá:', error)
    throw error
  }
}
export const getReviewTourById = async (tourId: string) => {
  try {
    const response = await apiClient.get(`/tour-reviews/tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tour đánh giá:', error);
    throw error;
  }
}