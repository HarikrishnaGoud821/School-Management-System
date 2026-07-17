import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import StatCard from "../../components/common/StatCard";
import studentService from "../../services/studentService";
import toast from "react-hot-toast";
import { FiPercent } from "react-icons/fi";

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    studentService.getAttendance().then((res) => setRecords(res.data)).catch(() => toast.error("Failed to load attendance"));
    studentService.getAttendancePercentage().then((res) => setPct(res.data.percentage));
  }, []);

  const columns = [
    { key: "courseName", label: "Course" },
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
        <h2 className="text-xl font-bold text-gray-800">My Attendance</h2>
        <p className="text-gray-500 text-sm">Track your attendance across all courses</p>
      </div>

      <div className="mb-6 max-w-xs">
        <StatCard icon={FiPercent} label="Overall Attendance" value={`${pct}%`} color={pct >= 75 ? "green" : "rose"} />
      </div>

      <Table columns={columns} data={records} searchKeys={["courseName", "status"]} />
    </DashboardLayout>
  );
};

export default MyAttendance;
