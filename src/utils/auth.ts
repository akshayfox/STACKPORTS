import { useAuthStore } from '@/store/authStore';

export const getHeaders = () => {
  const token = useAuthStore.getState().token;
  
  if (!token) {
    console.warn('No authentication token found in auth store');
    return {};
  }
  
  return {
    headers: {
      'x-access-token': token
    }
  };
};