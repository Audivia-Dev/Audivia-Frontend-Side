import apiClient from "@/utils/apiClient"
import { Post } from "@/models"

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  response: T;
}

export const getPostByUserId = async (userId: string): Promise<ApiResponse<Post[]>> => {
    try {
        const response = await apiClient.get(`/posts/users/${userId}`)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy danh sách bài đăng của người dùng', error)
        throw error
    }
}

export const getAllPosts = async (): Promise<ApiResponse<Post[]>> => {
    try {
        const response = await apiClient.get('/posts')
        return response.data
    } catch (error) {
        console.error('Lỗi lấy hết danh sách bài đăng')
        throw error
    }
}

export const createPost = async (
    images: string[], 
    location: string, 
    content: string, 
    createdBy: string
): Promise<ApiResponse<Post>> => {
    try {
        
        const postData = {
            title: "string",
            images: images,
            location: location || '',
            content: content.trim(),
            createdBy: createdBy
        };

        console.log('Sending post data:', postData); 

        const response = await apiClient.post('/posts', postData)
        return response.data
    } catch (error: any) {
        console.error('Lỗi tạo bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const updatePost = async (
    id: string, 
    data: Partial<Post>
) => {
    try {
        await apiClient.put(`/posts/${id}`, data)
    } catch (error: any) {
        console.error('Lỗi cập nhật thông tin bài đăng:', error.response?.data || error.message)
        throw error
    }
}

export const deletePost = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/posts/${id}`)
        return response.data
    } catch (error: any) {
        console.error('Lỗi xóa bài đăng:', error.response?.data || error.message)
        throw error
    }
}
