import api from "../api/axiosConfig";

const teacherService = {
  getAssignedCourses: () => api.get("/teacher/courses"),
  getStudentsInCourse: (courseId) => api.get(`/teacher/courses/${courseId}/students`),
  markAttendance: (data) => api.post("/teacher/attendance", data),
  getAttendanceByCourse: (courseId) => api.get(`/teacher/attendance/course/${courseId}`),
  enterMarks: (data) => api.post("/teacher/marks", data),
  updateMarks: (id, data) => api.put(`/teacher/marks/${id}`, data),
  getMarksByCourse: (courseId) => api.get(`/teacher/marks/course/${courseId}`),
};

export default teacherService;
