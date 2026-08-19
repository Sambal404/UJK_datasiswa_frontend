import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- ENDPOINT SISWA ---
export const getAllSiswa = async (page = 1, limit = 5, search = '') => {
    const response = await api.get(`/siswa?page=${page}&limit=${limit}&search=${search}`);
    return response.data; 
};

export const createSiswa = async (siswaData) => {
    const response = await api.post('/siswa', siswaData);
    return response.data;
};

export const updateSiswa = async (id, siswaData) => {
    const response = await api.put(`/siswa/${id}`, siswaData);
    return response.data;
};

export const deleteSiswa = async (id) => {
    const response = await api.delete(`/siswa/${id}`);
    return response.data;
};

export default api;