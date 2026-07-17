import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    try {
      const { data } = await adminService.getStudents();
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (student) => {
    setEditing(student);
    setForm(student);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await adminService.deleteStudent(id);
      toast.success("Student deleted");
      load();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateStudent(editing.id, form);
      toast.success("Student updated");
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to update student");
    }
  };

  const columns = [
    { key: "rollNumber", label: "Roll No." },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Class" },
    { key: "year", label: "Year" },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Students</h2>
          <p className="text-gray-500 text-sm">{students.length} students enrolled in the system</p>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <FiPlus /> New students are added via the Signup page
        </p>
      </div>

      <Table
        columns={columns}
        data={students}
        searchKeys={["name", "email", "rollNumber", "department"]}
        actions={(row) => (
          <div className="flex gap-2">
            <button onClick={() => openEdit(row)} className="text-indigo-600 hover:text-indigo-800">
              <FiEdit2 size={16} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="text-rose-500 hover:text-rose-700">
              <FiTrash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Student">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.department || ""}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.year || ""}
              onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium">
            Save Changes
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageStudents;
