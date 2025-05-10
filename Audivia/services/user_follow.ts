import apiClient from "@/utils/apiClient"

export const createUserFollow = async (followerId: string, followingId: string ) => {
    try {
        const response = await apiClient.post('/user-follows', {
                followerId, followingId
        })
        return response.data
    } catch (error) {
        console.error('Lỗi tạo thêm bạn', error)
        throw error
    }
}

export const deleteUserFollow = async (id: string) => {
    try {
        await apiClient.delete(`/user-follows/${id}`)
    } catch (error: any) {
        console.error('Lỗi xóa thêm bạn:', error.response?.data || error.message)
        throw error
    }
}

  