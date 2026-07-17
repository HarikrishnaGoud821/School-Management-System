import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import teacherService from "../../services/teacherService";
import toast from "react-hot-toast";
import { FiBookOpen, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await teacherService.getAssignedCourses();
        setCourses(data);
        const counts = {};
        await Promise.all(
          data.map(async (c) => {
            const res = await teacherService.getStudentsInCourse(c.id);
            counts[c.id] = res.data.length;
          })
        );
        setStudentCounts(counts);
      } catch {
        toast.error("Failed to load your courses");
      }
    };
    load();
  }, []);

  const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Teacher Dashboard</h2>
        <p className="text-gray-500 text-sm">Overview of your assigned courses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard icon={FiBookOpen} label="Assigned Courses" value={courses.length} color="indigo" />
        <StatCard icon={FiUsers} label="Total Students" value={totalStudents} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">My Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{c.courseName}</h4>
                <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                  {c.courseCode}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{c.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{studentCounts[c.id] ?? 0} students</span>
                <Link to="/teacher/attendance" className="text-primary-600 hover:underline">
                  Manage →
                </Link>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-gray-400 text-sm">No courses assigned yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
