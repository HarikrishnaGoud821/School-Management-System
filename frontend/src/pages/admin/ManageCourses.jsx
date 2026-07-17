import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiUserPlus } from "react-icons/fi";

const emptyForm = { courseName: "", courseCode: "", credits: "", description: "", teacherId: "" };

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollModal, setEnrollModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");

  const load = async () => {
    try {
      const [coursesRes, teachersRes, studentsRes] = await Promise.all([
        adminService.getCourses(),
        adminService.getTeachers(),
        adminService.getStudents(),
      ]);
      setCourses(coursesRes.data);
      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({ ...course, teacherId: course.teacherId || "" });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await adminService.deleteCourse(id);
      toast.success("Course deleted");
      load();
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      credits: form.credits ? parseInt(form.credits, 10) : null,
      teacherId: form.teacherId || null,
    };
    try {
      if (editing) {
        await adminService.updateCourse(editing.id, payload);
        toast.success("Course updated");
      } else {
        await adminService.createCourse(payload);
        toast.success("Course created");
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to save course");
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent) return;
    try {
      await adminService.enrollStudent(selectedStudent, enrollModal.id);
      toast.success("Student enrolled");
      setEnrollModal(null);
      setSelectedStudent("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll student");
    }
  };

  const columns = [
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course Name" },
    { key: "credits", label: "Credits" },
    { key: "teacherName", label: "Assigned Teacher", render: (r) => r.teacherName || "Unassigned" },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Courses</h2>
          <p className="text-gray-500 text-sm">{courses.length} courses offered</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <FiPlus /> Add Course
        </button>
      </div>

      <Table
        columns={columns}
        data={courses}
        searchKeys={["courseName", "courseCode", "teacherName"]}
        actions={(row) => (
          <div className="flex gap-3">
            <button onClick={() => setEnrollModal(row)} className="text-green-600 hover:text-green-800" title="Enroll student">
              <FiUserPlus size={16} />
            </button>
            <button onClick={() => openEdit(row)} className="text-indigo-600 hover:text-indigo-800">
              <FiEdit2 size={16} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="text-rose-500 hover:text-rose-700">
              <FiTrash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Course" : "Add Course"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">-- Unassigned --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium">
            {editing ? "Save Changes" : "Create Course"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={!!enrollModal} onClose={() => setEnrollModal(null)} title={`Enroll Student — ${enrollModal?.courseName || ""}`}>
        <div className="space-y-4">
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
          <button
            onClick={handleEnroll}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium"
          >
            Enroll
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageCourses;
