import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import notificationService from "../../services/notificationService";
import toast from "react-hot-toast";
import { FiBell } from "react-icons/fi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const load = () => {
    notificationService.getMyNotifications().then((res) => setNotifications(res.data)).catch(() => toast.error("Failed to load notifications"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      load();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
        <p className="text-gray-500 text-sm">Exam schedules, announcements and updates</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${
              n.isRead ? "border-gray-100" : "border-primary-200 bg-primary-50/30"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <FiBell size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p>
            </div>
            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="text-xs text-primary-600 hover:underline flex-shrink-0"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No notifications yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
