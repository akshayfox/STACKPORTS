import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/types/group';


const API_URL = `${import.meta.env.VITE_BASE_URL}/user`;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

const getHeaders = () => {
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

export const getGroups = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data;
};

export const getGroupById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, getHeaders());
  return response.data;
};

export const createGroup = async (GroupData: Omit<Group, '_id'>) => {
  const response = await axios.post(API_URL, GroupData, getHeaders());
  return response.data;
};

export const updateGroup = async (id: string, GroupData: Partial<Group>) => {
  const response = await axios.put(`${API_URL}/${id}`, GroupData, getHeaders());
  return response.data;
};

export const deleteGroup = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data;
};

export const getGroupByClientId = async (clientId: string | null) => {
  const res = await axios.get(`${API_URL}/client/${clientId}`,getHeaders());
  return res.data;
};