import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // If on standard ports (Nginx/Production), use relative path to support mobile/IP access
    if (window.location.port === '' || window.location.port === '80' || window.location.port === '443') {
      return '/api';
    }
    return `http://${window.location.hostname}:8080/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const getProblems = () => api.get('/problems');
export const getProblem = (id: string) => api.get(`/problems/${id}`);
export const submitCode = (problemId: number, code: string) => 
  api.post('/submissions', { problem_id: problemId, code });
export const getSubmission = (id: string) => api.get(`/submissions/${id}`);
export const createProblem = (problemData: any) => api.post('/problems', problemData);

export default api;
