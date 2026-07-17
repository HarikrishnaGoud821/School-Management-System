import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    try {
      const { data } = await adminService.getTeachers();
      setTeachers(data);
    } catch {
      toast.error("Failed to load teachers");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (teacher) => {
    setEditing(teacher);
    setForm(teacher);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher? This cannot be undone.")) return;
    try {
      await adminService.deleteTeacher(id);
      toast.success("Teacher deleted");
      load();
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTeacher(editing.id, form);
      toast.success("Teacher updated");
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to update teacher");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "experience", label: "Experience (yrs)" },
    { key: "qualification", label: "Qualification" },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Teachers</h2>
          <p className="text-gray-500 text-sm">{teachers.length} teachers in the system</p>
        </div>
        <p className="text-xs text-gray-400">New teachers are added via the Signup page</p>
      </div>

      <Table
        columns={columns}
        data={teachers}
        searchKeys={["name", "email", "subject"]}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Teacher">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.subject || ""}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (yrs)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.experience || ""}
              onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value, 10) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={form.qualification || ""}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
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

export default ManageTeachers;
