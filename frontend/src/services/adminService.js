import api from "../api/axiosConfig";

const adminService = {
  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  getStudents: () => api.get("/admin/students"),
  getStudent: (id) => api.get(`/admin/students/${id}`),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  getTeachers: () => api.get("/admin/teachers"),
  getTeacher: (id) => api.get(`/admin/teachers/${id}`),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),

  getCourses: () => api.get("/admin/courses"),
  createCourse: (data) => api.post("/admin/courses", data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  assignTeacher: (courseId, teacherId) =>
    api.post(`/admin/courses/${courseId}/assign-teacher/${teacherId}`),
  enrollStudent: (studentId, courseId) =>
    api.post("/admin/enroll", { studentId, courseId }),
};

export default adminService;
