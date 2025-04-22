import axios from 'axios';
import { Client } from '@/types/client';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';


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
  try {
    const response = await axios.get(API_URL, {
      ...getHeaders(),
      params: { role: 'client' },
    });
    return response.data?.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch clients",
    });
    throw error;
  }
};


export const getClientById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, getHeaders());
  return response.data;
};

export const createClient = async (clientData: Omit<Client, '_id'>) => {
  try {
    const response = await axios.post(API_URL, clientData, getHeaders());
    toast({
      title: "Success",
      description: "Client created successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to create client",
    });
    throw error;
  }
};

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, clientData, getHeaders());
    toast({
      title: "Success",
      description: "Client updated successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to update client",
    });
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
    toast({
      title: "Success",
      description: "Client deleted successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to delete client",
    });
    throw error;
  }
};