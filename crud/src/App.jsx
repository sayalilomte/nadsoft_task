import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "https://crudcrud.com/api/3ad42c03342049d1b19418606b6c7265/members";

function App() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    age: "",
    parent_id: "",
  });

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/${id}`);
          toast.success("Member deleted successfully!");
          fetchMembers();
        } catch (error) {
          toast.error("Error deleting member!");
        }
      }
    });
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setSelectedMember(response.data);
      setShowEditModal(true);
    } catch (error) {
      toast.error("Error fetching member details!");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${selectedMember._id}`, selectedMember);
      toast.success("Member updated successfully!");
      setShowEditModal(false);
      fetchMembers();
    } catch (error) {
      toast.error("Error updating member!");
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await axios.post(API_BASE_URL, newMember);
      toast.success("Member added successfully!");
      setShowAddModal(false);
      fetchMembers();
      setNewMember({ name: "", email: "", age: "", parent_id: "" });
    } catch (error) {
      toast.error("Error adding member!");
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h1 className="text-center mb-4">All Members</h1>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
        <button
          className="btn btn-success"
          onClick={() => setShowAddModal(true)}
        >
          Add New Member
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Member Name</th>
            <th>Member Email</th>
            <th>Age</th>
            <th>Parent ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMembers.length > 0 ? (
            paginatedMembers.map((member) => (
              <tr key={member._id}>
                <td>{member._id}</td>
                <td>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleEditClick(member._id)}
                  >
                    {member.name}
                  </button>
                </td>
                <td>{member.email}</td>
                <td>{member.age}</td>
                <td>{member.parent_id}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(member._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredMembers.length / limit)}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === Math.ceil(filteredMembers.length / limit)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newMember.email}
                      onChange={(e) =>
                        setNewMember({ ...newMember, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newMember.age}
                      onChange={(e) =>
                        setNewMember({ ...newMember, age: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Parent ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMember.parent_id}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          parent_id: e.target.value,
                        })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddMember}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
