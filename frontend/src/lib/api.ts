import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = Cookies.get("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/token/refresh/`,
            { refresh }
          );
          Cookies.set("access_token", data.access, { expires: 1 });
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    school?: number;
  }) => api.post("/auth/register/", data),
  me: () => api.get("/auth/me/"),
  changePassword: (old_password: string, new_password: string) =>
    api.post("/auth/change-password/", { old_password, new_password }),
};

export const curriculumApi = {
  subjects: () => api.get("/curriculum/subjects/"),
  subject: (id: number) => api.get(`/curriculum/subjects/${id}/`),
  lessons: (params?: Record<string, unknown>) => api.get("/curriculum/lessons/", { params }),
  lesson: (id: number) => api.get(`/curriculum/lessons/${id}/`),
  markComplete: (id: number) => api.post(`/curriculum/lessons/${id}/mark_complete/`),
  markStarted: (id: number) => api.post(`/curriculum/lessons/${id}/mark_started/`),
  progress: () => api.get("/curriculum/progress/"),
  ovepValues: () => api.get("/curriculum/ovep-values/"),
  scenarios: (params?: Record<string, unknown>) => api.get("/curriculum/scenarios/", { params }),
};

export const assessmentApi = {
  list: (params?: Record<string, unknown>) => api.get("/assessments/quizzes/", { params }),
  detail: (id: number) => api.get(`/assessments/quizzes/${id}/`),
  start: (id: number) => api.post(`/assessments/quizzes/${id}/start/`),
  submit: (id: number, answers: Record<string, string>) =>
    api.post(`/assessments/quizzes/${id}/submit/`, { answers }),
  attempts: () => api.get("/assessments/attempts/"),
  attempt: (id: string) => api.get(`/assessments/attempts/${id}/`),
  certificates: () => api.get("/assessments/certificates/"),
  achievements: () => api.get("/assessments/achievements/"),
};

export const analyticsApi = {
  teacherDashboard: () => api.get("/analytics/teacher/dashboard/"),
  studentProgress: (studentId: string) =>
    api.get(`/analytics/teacher/students/${studentId}/`),
  myStats: () => api.get("/analytics/me/stats/"),
};

export const classApi = {
  list: () => api.get("/auth/classes/"),
  detail: (id: number) => api.get(`/auth/classes/${id}/`),
  create: (data: { name: string; school: number }) => api.post("/auth/classes/", data),
  addStudent: (classId: number, studentId: string) =>
    api.post(`/auth/classes/${classId}/add_student/`, { student_id: studentId }),
  removeStudent: (classId: number, studentId: string) =>
    api.post(`/auth/classes/${classId}/remove_student/`, { student_id: studentId }),
  students: (params?: Record<string, unknown>) =>
    api.get("/auth/users/", { params: { role: "student", ...params } }),
};
