import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import studentService from "../../services/studentService";
import toast from "react-hot-toast";

const MyMarks = () => {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    studentService.getMarks().then((res) => setMarks(res.data)).catch(() => toast.error("Failed to load marks"));
  }, []);

  const columns = [
    { key: "courseName", label: "Course" },
    { key: "examType", label: "Exam Type" },
    { key: "marks", label: "Marks", render: (r) => `${r.marks} / ${r.maxMarks}` },
    {
      key: "grade",
      label: "Grade",
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">{r.grade}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Marks</h2>
        <p className="text-gray-500 text-sm">View your grades across all courses and exams</p>
      </div>

      <Table columns={columns} data={marks} searchKeys={["courseName", "examType"]} />
    </DashboardLayout>
  );
};

export default MyMarks;
