import apiClient from "@/utils/apiClient"

export const createSaveTour = async (userId: string, tourId: string ) => {
    try {
        const plannedTime = null
        const response = await apiClient.post('/save-tours', {
            userId, tourId, plannedTime
        })
        return response.data
    } catch (error) {
        console.error('Lỗi tạo tour yêu thích', error)
        throw error
    }
}