import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiBarChart2,
  FiCheckSquare,
  FiAward,
  FiUser,
  FiBell,
  FiClipboard,
} from "react-icons/fi";

const NAV_ITEMS = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiHome },
    { to: "/admin/students", label: "Students", icon: FiUsers },
    { to: "/admin/teachers", label: "Teachers", icon: FiUserCheck },
    { to: "/admin/courses", label: "Courses", icon: FiBookOpen },
    { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  ],
  TEACHER: [
    { to: "/teacher/dashboard", label: "Dashboard", icon: FiHome },
    { to: "/teacher/attendance", label: "Attendance", icon: FiCheckSquare },
    { to: "/teacher/marks", label: "Marks", icon: FiAward },
  ],
  STUDENT: [
    { to: "/student/dashboard", label: "Dashboard", icon: FiHome },
    { to: "/student/profile", label: "Profile", icon: FiUser },
    { to: "/student/attendance", label: "Attendance", icon: FiClipboard },
    { to: "/student/marks", label: "Marks", icon: FiAward },
    { to: "/student/notifications", label: "Notifications", icon: FiBell },
  ],
};

const Sidebar = ({ role, open }) => {
  const items = NAV_ITEMS[role] || [];

  return (
    <aside
      className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-100 transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
          S
        </div>
        <span className="font-semibold text-gray-800">SMS Portal</span>
      </div>
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
