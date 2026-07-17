import api from "../api/axiosConfig";

const notificationService = {
  getMyNotifications: () => api.get("/notifications"),
  create: (message, userId) => api.post("/notifications", { message, userId }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

export default notificationService;
