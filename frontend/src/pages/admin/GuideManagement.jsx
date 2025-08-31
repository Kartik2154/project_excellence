// frontend/src/pages/admin/GuideManagement.jsx
import React, { useEffect, useState } from "react";
import { guideAPI } from "../../services/api"; // ✅ from api.js
import { toast } from "react-toastify";

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [showEditGuideModal, setShowEditGuideModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  // Form States
  const [newGuide, setNewGuide] = useState({
    name: "",
    expertise: "",
    email: "",
    phone: "",
    password: "",
  });
  const [editGuide, setEditGuide] = useState(null);

  // ✅ Fetch guides on mount
  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data } = await guideAPI.getAll();
      setGuides(data);
    } catch (err) {
      toast.error("Failed to load guides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // ✅ Add Guide
  const handleSaveNewGuide = async () => {
    try {
      await guideAPI.add(newGuide);
      toast.success("Guide added successfully");
      setShowAddGuideModal(false);
      setNewGuide({
        name: "",
        expertise: "",
        email: "",
        phone: "",
        password: "",
      });
      fetchGuides();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add guide");
    }
  };

  // ✅ Edit Guide
  const handleSaveEdit = async () => {
    try {
      await guideAPI.update(editGuide._id, editGuide);
      toast.success("Guide updated successfully");
      setShowEditGuideModal(false);
      setEditGuide(null);
      fetchGuides();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update guide");
    }
  };

  // ✅ Delete Guide
  const handleDeleteGuide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    try {
      await guideAPI.delete(id);
      toast.success("Guide deleted");
      setGuides((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete guide");
    }
  };

  // ✅ Accept/Reject Pending Requests
  const handleAcceptRequest = async (id) => {
    try {
      await guideAPI.updateStatus(id, "approved");
      toast.success("Guide approved");
      fetchGuides();
    } catch (err) {
      toast.error("Failed to approve request:", err);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await guideAPI.updateStatus(id, "rejected");
      toast.success("Guide rejected");
      fetchGuides();
    } catch (err) {
      toast.error("Failed to reject request:", err);
    }
  };

  const pendingRequests = guides.filter((g) => g.status === "pending");

  return (
    <div className="p-4 text-gray-200 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Guide Management</h1>

      {/* Add Guide Button */}
      <button
        onClick={() => setShowAddGuideModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Add Guide
      </button>

      {/* Requests Button */}
      <button
        onClick={() => setShowRequestsModal(true)}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 ml-2 rounded"
      >
        Pending Requests ({pendingRequests.length})
      </button>

      {/* Guides Table */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <table className="w-full mt-4 border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="p-2 border border-gray-700">Name</th>
              <th className="p-2 border border-gray-700">Expertise</th>
              <th className="p-2 border border-gray-700">Email</th>
              <th className="p-2 border border-gray-700">Phone</th>
              <th className="p-2 border border-gray-700">Status</th>
              <th className="p-2 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr
                key={g._id}
                className="border border-gray-700 hover:bg-gray-800"
              >
                <td className="p-2 border border-gray-700">{g.name}</td>
                <td className="p-2 border border-gray-700">{g.expertise}</td>
                <td className="p-2 border border-gray-700">{g.email}</td>
                <td className="p-2 border border-gray-700">{g.phone || "-"}</td>
                <td className="p-2 border border-gray-700">{g.status}</td>
                <td className="p-2 border border-gray-700 space-x-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditGuide(g);
                      setShowEditGuideModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteGuide(g._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Guide Modal */}
      {showAddGuideModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 text-gray-200 p-6 rounded shadow w-96">
            <h2 className="font-bold mb-4 text-white">Add New Guide</h2>
            {["name", "expertise", "email", "phone", "password"].map(
              (field) => (
                <input
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  placeholder={field}
                  className="w-full bg-gray-900 border border-gray-700 text-gray-200 p-2 mb-2 rounded"
                  value={newGuide[field]}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, [field]: e.target.value })
                  }
                />
              )
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddGuideModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewGuide}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Guide Modal */}
      {showEditGuideModal && editGuide && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 text-gray-200 p-6 rounded shadow w-96">
            <h2 className="font-bold mb-4 text-white">Edit Guide</h2>
            {["name", "expertise", "email", "phone"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                className="w-full bg-gray-900 border border-gray-700 text-gray-200 p-2 mb-2 rounded"
                value={editGuide[field]}
                onChange={(e) =>
                  setEditGuide({ ...editGuide, [field]: e.target.value })
                }
              />
            ))}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditGuideModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 text-gray-200 p-6 rounded shadow w-96">
            <h2 className="font-bold mb-4 text-white">Pending Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-400">No pending requests</p>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {req.name} ({req.expertise})
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowRequestsModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
