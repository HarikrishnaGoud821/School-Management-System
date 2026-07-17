import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import adminService from "../../services/adminService";
import teacherService from "../../services/teacherService";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiDownload } from "react-icons/fi";

const Reports = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    adminService.getCourses().then((res) => setCourses(res.data)).catch(() => toast.error("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setMarks([]);
      setAttendance([]);
      return;
    }
    teacherService.getMarksByCourse(selectedCourse).then((res) => setMarks(res.data)).catch(() => {});
    teacherService.getAttendanceByCourse(selectedCourse).then((res) => setAttendance(res.data)).catch(() => {});
  }, [selectedCourse]);

  const marksChartData = marks.map((m) => ({ name: m.studentName, marks: m.marks }));

  const attendanceSummary = {};
  attendance.forEach((a) => {
    attendanceSummary[a.studentName] = attendanceSummary[a.studentName] || { present: 0, total: 0 };
    attendanceSummary[a.studentName].total += 1;
    if (a.status === "PRESENT") attendanceSummary[a.studentName].present += 1;
  });
  const attendanceChartData = Object.entries(attendanceSummary).map(([name, v]) => ({
    name,
    percentage: Math.round((v.present / v.total) * 100),
  }));

  const exportCSV = (rows, filename) => {
    if (rows.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => r[h]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Reports</h2>
        <p className="text-gray-500 text-sm">Attendance and performance reports by course</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.courseName} ({c.courseCode})
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Marks Report</h3>
              <button
                onClick={() => exportCSV(marks, "marks_report.csv")}
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
              >
                <FiDownload size={14} /> Export CSV
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={marksChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="marks" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Attendance Report (%)</h3>
              <button
                onClick={() => exportCSV(attendance, "attendance_report.csv")}
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
              >
                <FiDownload size={14} /> Export CSV
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
