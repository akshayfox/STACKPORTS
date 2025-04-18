import axios from 'axios';
import { Client } from '@/types/client';
import { useAuthStore } from '@/store/authStore';

const API_URL = `${import.meta.env.VITE_BASE_URL}/clients`;

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

export const getClients = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data;
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