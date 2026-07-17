import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import teacherService from "../../services/teacherService";
import toast from "react-hot-toast";

const Marks = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [examType, setExamType] = useState("MIDTERM");
  const [marksMap, setMarksMap] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    teacherService.getAssignedCourses().then((res) => setCourses(res.data)).catch(() => toast.error("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    teacherService.getStudentsInCourse(selectedCourse).then((res) => setStudents(res.data));
    teacherService.getMarksByCourse(selectedCourse).then((res) => setRecords(res.data));
  }, [selectedCourse]);

  const submitMarks = async () => {
    try {
      await Promise.all(
        students
          .filter((s) => marksMap[s.id] !== undefined && marksMap[s.id] !== "")
          .map((s) =>
            teacherService.enterMarks({
              studentId: s.id,
              courseId: selectedCourse,
              examType,
              marks: parseFloat(marksMap[s.id]),
              maxMarks: 100,
            })
          )
      );
      toast.success("Marks submitted successfully");
      const res = await teacherService.getMarksByCourse(selectedCourse);
      setRecords(res.data);
      setMarksMap({});
    } catch {
      toast.error("Failed to submit marks");
    }
  };

  const columns = [
    { key: "studentName", label: "Student" },
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
        <h2 className="text-xl font-bold text-gray-800">Manage Marks</h2>
        <p className="text-gray-500 text-sm">Enter and update exam marks for your courses</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
            </select>
          </div>
        </div>

        {selectedCourse && students.length > 0 && (
          <div className="space-y-2">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-gray-50 py-2">
                <span className="text-sm text-gray-700">{s.name} ({s.rollNumber})</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Marks / 100"
                  className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  value={marksMap[s.id] || ""}
                  onChange={(e) => setMarksMap({ ...marksMap, [s.id]: e.target.value })}
                />
              </div>
            ))}
            <button
              onClick={submitMarks}
              className="mt-3 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Submit Marks
            </button>
          </div>
        )}
      </div>

      {selectedCourse && <Table columns={columns} data={records} searchKeys={["studentName", "examType"]} />}
    </DashboardLayout>
  );
};

export default Marks;
