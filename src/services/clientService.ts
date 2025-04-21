import axios from 'axios';
import { Client } from '@/types/client';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';


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

export const getClients = async () => {
  const response = await axios.get(API_URL, {
    ...getHeaders(),
    params: { role: 'client' },
  });
  return response.data?.data;
};


export const getClientById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, getHeaders());
  return response.data;
};

export const createClient = async (clientData: Omit<Client, '_id'>) => {
  const response = await axios.post(API_URL, clientData, getHeaders());
  return response.data;
};

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const response = await axios.put(`${API_URL}/${id}`, clientData, getHeaders());
  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data;
};