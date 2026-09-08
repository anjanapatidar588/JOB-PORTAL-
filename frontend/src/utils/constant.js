const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
export const BASE_URL = (envUrl || 'https://job-portal-backend-o7fz.onrender.com').replace(/\/+$/, '');

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const NOTIFICATION_API_END_POINT = `${BASE_URL}/api/v1/notification`;