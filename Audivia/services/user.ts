import apiClient from '@/utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;

    // Lưu token vào AsyncStorage
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/register', {
      userName: username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Đăng ký thất bại:', error);
    throw error;
  }
};

export const getUserInfo = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    // Thêm token vào header thủ công
    const response = await apiClient.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};