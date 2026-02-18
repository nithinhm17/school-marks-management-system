import axios from 'axios';
import { Platform } from 'react-native';

// Replace with your machine's local IP address
// For Android Emulator, 10.0.2.2 points to localhost
// For iOS Simulator, localhost works
// For physical device, use your machine's LAN IP (e.g., 192.168.1.x)
const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: DEV_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || { message: 'Network Error' });
    }
);

export const schoolAPI = {
    getAll: () => api.get('/schools'),
    create: (data) => api.post('/schools', data),
    update: (id, data) => api.put(`/schools/${id}`, data),
    delete: (id) => api.delete(`/schools/${id}`),
};

export const boardAPI = {
    getAll: () => api.get('/boards'),
    create: (data) => api.post('/boards', data),
    update: (id, data) => api.put(`/boards/${id}`, data),
    delete: (id) => api.delete(`/boards/${id}`),
};

export const classAPI = {
    getAll: (schoolId) => api.get('/classes', { params: { school: schoolId } }),
    create: (data) => api.post('/classes', data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`),
};

export const subjectAPI = {
    getAll: (classId) => api.get('/subjects', { params: { class: classId } }),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`),
};

export const studentAPI = {
    getAll: (params) => api.get('/students', { params }),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
};

export const examAPI = {
    getAll: (classId) => api.get('/exams', { params: { class: classId } }),
    create: (data) => api.post('/exams', data),
    update: (id, data) => api.put(`/exams/${id}`, data),
    delete: (id) => api.delete(`/exams/${id}`),
};

export const gradeRangeAPI = {
    getAll: (schoolId) => api.get('/grade-ranges', { params: { school: schoolId } }),
    create: (data) => api.post('/grade-ranges', data),
    update: (id, data) => api.put(`/grade-ranges/${id}`, data),
    delete: (id) => api.delete(`/grade-ranges/${id}`),
};

export const examWeightageAPI = {
    getAll: (params) => api.get('/exam-weightage', { params }),
    create: (data) => api.post('/exam-weightage', data),
    update: (id, data) => api.put(`/exam-weightage/${id}`, data),
    delete: (id) => api.delete(`/exam-weightage/${id}`),
};

export const marksAPI = {
    getAll: (params) => api.get('/marks', { params }),
    create: (data) => api.post('/marks', data),
    bulkCreate: (marks) => api.post('/marks/bulk', { marks }),
    update: (id, data) => api.put(`/marks/${id}`, data),
    delete: (id) => api.delete(`/marks/${id}`),
};

export const resultsAPI = {
    getStudentResult: (studentId) => api.get(`/results/student/${studentId}`),
    getStudentExamResult: (studentId, examId) => api.get(`/results/student/${studentId}/exam/${examId}`),
    getClassResults: (classId, examId) => api.get(`/results/class/${classId}/exam/${examId}`),
};

export default api;
