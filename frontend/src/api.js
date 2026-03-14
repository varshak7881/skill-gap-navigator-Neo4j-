import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://127.0.0.1:8000' 
});

export const createUser = (data) => API.post('/users/create', data);
export const getJobs = () => API.get('/jobs/');
export const getGap = (uid, jid) => API.get(`/recommend/gap?user_id=${uid}&job_id=${jid}`);
export const getCourses = (uid, jid) => API.get(`/recommend/courses?user_id=${uid}&job_id=${jid}`);
export const getPath = (uid, jid) => API.get(`/recommend/path?user_id=${uid}&job_id=${jid}`);