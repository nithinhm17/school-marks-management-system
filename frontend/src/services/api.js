import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Standard response handler
const handle = (promise) => promise.then(r => r.data);

// Academic Boards
export const boardAPI = {
    getAll: () => handle(API.get('/academic-boards')),
    create: (data) => handle(API.post('/academic-boards', data)),
    update: (id, data) => handle(API.put(`/academic-boards/${id}`, data)),
    delete: (id) => handle(API.delete(`/academic-boards/${id}`)),
};

// Schools
export const schoolAPI = {
    getAll: () => handle(API.get('/schools')),
    getById: (id) => handle(API.get(`/schools/${id}`)),
    create: (data) => handle(API.post('/schools', data)),
    update: (id, data) => handle(API.put(`/schools/${id}`, data)),
    delete: (id) => handle(API.delete(`/schools/${id}`)),
};

// Classes
export const classAPI = {
    getAll: (schoolId) => handle(API.get('/classes', { params: { school: schoolId } })),
    create: (data) => handle(API.post('/classes', data)),
    update: (id, data) => handle(API.put(`/classes/${id}`, data)),
    delete: (id) => handle(API.delete(`/classes/${id}`)),
};

// Subjects
export const subjectAPI = {
    getAll: (classId) => handle(API.get('/subjects', { params: { class: classId } })),
    create: (data) => handle(API.post('/subjects', data)),
    update: (id, data) => handle(API.put(`/subjects/${id}`, data)),
    delete: (id) => handle(API.delete(`/subjects/${id}`)),
};

// Students
export const studentAPI = {
    getAll: (params) => handle(API.get('/students', { params })),
    getById: (id) => handle(API.get(`/students/${id}`)),
    create: (data) => handle(API.post('/students', data)),
    update: (id, data) => handle(API.put(`/students/${id}`, data)),
    delete: (id) => handle(API.delete(`/students/${id}`)),
};

// Exams
export const examAPI = {
    getAll: (classId) => handle(API.get('/exams', { params: { class: classId } })),
    create: (data) => handle(API.post('/exams', data)),
    update: (id, data) => handle(API.put(`/exams/${id}`, data)),
    delete: (id) => handle(API.delete(`/exams/${id}`)),
};

// Grade Ranges
export const gradeRangeAPI = {
    getAll: (schoolId) => handle(API.get('/grade-ranges', { params: { school: schoolId } })),
    create: (data) => handle(API.post('/grade-ranges', data)),
    update: (id, data) => handle(API.put(`/grade-ranges/${id}`, data)),
    delete: (id) => handle(API.delete(`/grade-ranges/${id}`)),
};

// Exam Weightage
export const examWeightageAPI = {
    getAll: (params) => handle(API.get('/exam-weightage', { params })),
    create: (data) => handle(API.post('/exam-weightage', data)),
    update: (id, data) => handle(API.put(`/exam-weightage/${id}`, data)),
    delete: (id) => handle(API.delete(`/exam-weightage/${id}`)),
};

// Marks
export const marksAPI = {
    getAll: (params) => handle(API.get('/marks', { params })),
    create: (data) => handle(API.post('/marks', data)),
    bulkCreate: (marks) => handle(API.post('/marks/bulk', { marks })),
    update: (id, data) => handle(API.put(`/marks/${id}`, data)),
    delete: (id) => handle(API.delete(`/marks/${id}`)),
};

// Results
export const resultsAPI = {
    getStudentResult: (studentId) => handle(API.get(`/results/student/${studentId}`)),
    getStudentExamResult: (studentId, examId) => handle(API.get(`/results/student/${studentId}/exam/${examId}`)),
    getClassResults: (classId, examId) => handle(API.get(`/results/class/${classId}/exam/${examId}`)),
};
