import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

export const getProblems = () => api.get('/problems');
export const getProblem = (id: string) => api.get(`/problems/${id}`);
export const submitCode = (problemId: number, code: string) => 
  api.post('/submissions', { problem_id: problemId, code });
export const getSubmission = (id: string) => api.get(`/submissions/${id}`);

export default api;
