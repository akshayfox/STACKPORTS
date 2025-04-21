import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/types/group';
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
  try {
    const response = await axios.get(API_URL, getHeaders());
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch groups",
    });
    throw error;
  }
};

export const getGroupById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getHeaders());
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch group",
    });
    throw error;
  }
};

export const createGroup = async (GroupData: Omit<Group, '_id'>) => {
  try {
    const response = await axios.post(API_URL, GroupData, getHeaders());
    toast({
      title: "Success",
      description: "Group created successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to create group",
    });
    throw error;
  }
};

export const updateGroup = async (id: string, GroupData: Partial<Group>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, GroupData, getHeaders());
    toast({
      title: "Success",
      description: "Group updated successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to update group",
    });
    throw error;
  }
};

export const deleteGroup = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
    toast({
      title: "Success",
      description: "Group deleted successfully",
    });
    return response.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to delete group",
    });
    throw error;
  }
};

export const getGroupByClientId = async (clientId: string | null) => {
  try {
    const res = await axios.get(`${API_URL}/client/${clientId}`,getHeaders());
    return res.data?.data;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.message || "Failed to fetch group by client ID",
    });
    throw error;
  }
};