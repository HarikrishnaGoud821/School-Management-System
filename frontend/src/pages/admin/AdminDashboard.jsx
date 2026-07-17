import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import adminService from "../../services/adminService";
import { FiUsers, FiUserCheck, FiBookOpen, FiPercent } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, coursesRes, teachersRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getCourses(),
          adminService.getTeachers(),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      }
    };
    load();
  }, []);

  const courseCreditsData = courses.map((c) => ({ name: c.courseCode || c.courseName, credits: c.credits || 0 }));
  const teacherLoadData = teachers.map((t) => ({
    name: t.name,
    value: courses.filter((c) => c.teacherId === t.id).length,
  })).filter((t) => t.value > 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FiUsers} label="Total Students" value={stats?.totalStudents ?? "—"} color="indigo" />
        <StatCard icon={FiUserCheck} label="Total Teachers" value={stats?.totalTeachers ?? "—"} color="green" />
        <StatCard icon={FiBookOpen} label="Total Courses" value={stats?.totalCourses ?? "—"} color="amber" />
        <StatCard
          icon={FiPercent}
          label="Avg. Attendance"
          value={stats ? `${stats.averageAttendancePercentage}%` : "—"}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Course Credits Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseCreditsData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="credits" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Teacher Course Load</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={teacherLoadData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {teacherLoadData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
