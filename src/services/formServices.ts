import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface StudentCard {
  id: string;
  name: string;
  thumbnail?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  elements: any[];
  client: string;
  group: string;
  createdBy: string;
}

export const createStudentCard = async (cardData: StudentCard, thumbnailFile?: File) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(cardData));
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  const response = await axios.post(`${BASE_URL}/student-cards`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getStudentCards = async () => {
  const response = await axios.get(`${BASE_URL}/student-cards`);
  return response.data;
};

export const getStudentCardById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/student-cards/${id}`);
  return response.data;
};

export const updateStudentCard = async (id: string, cardData: Partial<StudentCard>, thumbnailFile?: File) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(cardData));
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  const response = await axios.put(`${BASE_URL}/student-cards/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteStudentCard = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/student-cards/${id}`);
  return response.data;
};