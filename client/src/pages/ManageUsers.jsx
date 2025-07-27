import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users'));
  }, []);

  const confirmDelete = (id) => setDeletingUserId(id);
  const cancelDelete = () => setDeletingUserId(null);

  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await API.delete(`/users/${deletingUserId}`);
      setUsers(users.filter(u => u.id !== deletingUserId));
    } catch {
      alert('Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Users</h2>

      <button
        onClick={() => navigate('/admin/users/add')}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add New User
      </button>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6">{u.id}</td>
                <td className="py-3 px-6">{u.name}</td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6">{u.roleId === 1 ? 'Admin' : 'User'}</td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button
                    onClick={() => confirmDelete(u.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md shadow-sm transition"
                    aria-label={`Delete user ${u.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {deletingUserId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
