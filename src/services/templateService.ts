import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/designs`;

export const getTemplates = async () => {
  const response = await axios.get(API_URL);
  console.log(response,'response')
  return response?.data?.designs;
};

export const getTemplateById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTemplate = async (templateData: any) => {
  const response = await axios.post(API_URL, templateData);
  return response.data;
};

export const updateTemplate = async (id: string, templateData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, templateData);
  return response.data;
};

export const deleteTemplate = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};