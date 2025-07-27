import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 2, // default to User
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (newUser.password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setFormLoading(true);

    try {
      // Exclude confirmPassword before sending
      const { confirmPassword, ...sendData } = newUser;
      await API.post('/users', sendData);
      setFormSuccess('User added successfully!');
      setNewUser({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: 2,
      });
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add user.';
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add New User</h2>

      {formError && <p className="text-red-600 mb-4 font-medium">{formError}</p>}
      {formSuccess && <p className="text-green-600 mb-4 font-medium">{formSuccess}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleChange}
          disabled={formLoading}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          disabled={formLoading}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleChange}
          disabled={formLoading}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={newUser.confirmPassword}
          onChange={handleChange}
          disabled={formLoading}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="roleId"
          value={newUser.roleId}
          onChange={handleChange}
          disabled={formLoading}
          className="w-full p-2 border rounded"
        >
          <option value={2}>User</option>
          <option value={1}>Admin</option>
        </select>

        <button
          type="submit"
          disabled={formLoading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {formLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      <button
        onClick={() => navigate('/admin/users')}
        className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
      >
        Back to Manage Users
      </button>
    </div>
  );
};

export default AddUser;
