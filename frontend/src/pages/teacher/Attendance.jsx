import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import teacherService from "../../services/teacherService";
import toast from "react-hot-toast";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusMap, setStatusMap] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    teacherService.getAssignedCourses().then((res) => setCourses(res.data)).catch(() => toast.error("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    teacherService.getStudentsInCourse(selectedCourse).then((res) => {
      setStudents(res.data);
      const initial = {};
      res.data.forEach((s) => (initial[s.id] = "PRESENT"));
      setStatusMap(initial);
    });
    teacherService.getAttendanceByCourse(selectedCourse).then((res) => setRecords(res.data));
  }, [selectedCourse]);

  const submitAttendance = async () => {
    try {
      await Promise.all(
        students.map((s) =>
          teacherService.markAttendance({
            studentId: s.id,
            courseId: selectedCourse,
            date,
            status: statusMap[s.id],
          })
        )
      );
      toast.success("Attendance marked successfully");
      const res = await teacherService.getAttendanceByCourse(selectedCourse);
      setRecords(res.data);
    } catch {
      toast.error("Failed to mark attendance");
    }
  };

  const columns = [
    { key: "studentName", label: "Student" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            r.status === "PRESENT"
              ? "bg-green-50 text-green-600"
              : r.status === "LATE"
              ? "bg-amber-50 text-amber-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Attendance</h2>
        <p className="text-gray-500 text-sm">Mark and review student attendance by course</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Select course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {selectedCourse && students.length > 0 && (
          <div className="space-y-2">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-gray-50 py-2">
                <span className="text-sm text-gray-700">{s.name} ({s.rollNumber})</span>
                <select
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  value={statusMap[s.id] || "PRESENT"}
                  onChange={(e) => setStatusMap({ ...statusMap, [s.id]: e.target.value })}
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </div>
            ))}
            <button
              onClick={submitAttendance}
              className="mt-3 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>

      {selectedCourse && <Table columns={columns} data={records} searchKeys={["studentName"]} />}
    </DashboardLayout>
  );
};

export default Attendance;
