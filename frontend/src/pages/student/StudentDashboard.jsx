import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import studentService from "../../services/studentService";
import toast from "react-hot-toast";
import { FiBookOpen, FiPercent, FiAward } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [attendancePct, setAttendancePct] = useState(0);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesRes, pctRes, marksRes] = await Promise.all([
          studentService.getEnrolledCourses(),
          studentService.getAttendancePercentage(),
          studentService.getMarks(),
        ]);
        setCourses(coursesRes.data);
        setAttendancePct(pctRes.data.percentage);
        setMarks(marksRes.data);
      } catch {
        toast.error("Failed to load dashboard data");
      }
    };
    load();
  }, []);

  const avgMarks = marks.length
    ? Math.round((marks.reduce((sum, m) => sum + (m.marks / m.maxMarks) * 100, 0) / marks.length) * 100) / 100
    : 0;

  const pieData = [
    { name: "Present", value: attendancePct },
    { name: "Absent", value: 100 - attendancePct },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Dashboard</h2>
        <p className="text-gray-500 text-sm">A quick overview of your academic progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FiBookOpen} label="Enrolled Courses" value={courses.length} color="indigo" />
        <StatCard icon={FiPercent} label="Attendance" value={`${attendancePct}%`} color="green" />
        <StatCard icon={FiAward} label="Average Score" value={`${avgMarks}%`} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">My Courses</h3>
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.courseName}</p>
                  <p className="text-xs text-gray-400">Taught by {c.teacherName || "TBA"}</p>
                </div>
                <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                  {c.courseCode}
                </span>
              </div>
            ))}
            {courses.length === 0 && <p className="text-gray-400 text-sm">No courses enrolled yet.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
