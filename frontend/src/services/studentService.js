import api from "../api/axiosConfig";

const studentService = {
  getProfile: () => api.get("/student/profile"),
  updateProfile: (data) => api.put("/student/profile", data),
  getEnrolledCourses: () => api.get("/student/courses"),
  getAttendance: () => api.get("/student/attendance"),
  getAttendancePercentage: () => api.get("/student/attendance/percentage"),
  getMarks: () => api.get("/student/marks"),
};

export default studentService;
