import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const res = await API.get('/admin/profile');
        setProfile({ ...res.data, password: '', confirmPassword: '' });
        setError('');
      } catch {
        setError('Failed to load profile. Please try again later.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (profile.password && profile.password !== profile.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...updateData } = profile;
      if (!updateData.password) delete updateData.password;

      await API.put('/admin/profile', updateData);
      setSuccess('Profile updated successfully!');
      setError('');
      setProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed. Please try again.';
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    API.defaults.headers.common['Authorization'] = '';
    setProfile({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('Logged out successfully.');
    alert('You have been logged out.');
    setTimeout(() => {
      setSuccess('');
    }, 3000);
    navigate('/home');
  };

  // --- NEW: Delete account handler ---
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    try {
      await API.delete('/admin/profile'); // Backend route to delete admin account
      alert('Your account has been deleted.');
      handleLogout();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete account.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Profile</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded relative">
          {error}
          <button
            onClick={() => setError('')}
            className="absolute top-1 right-2 text-red-700 font-bold"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded relative">
          {success}
          <button
            onClick={() => setSuccess('')}
            className="absolute top-1 right-2 text-green-700 font-bold"
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Name</label>
          <input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Password <span className="text-sm text-gray-500">(leave blank to keep unchanged)</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>

        {profile.password && (
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={profile.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        <button
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => navigate("/admin/users")}
          disabled={loading}
        >
          Manage Users
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={loading}
        >
          Logout
        </button>

        {/* Delete account button */}
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900"
          disabled={loading}
          aria-label="Delete my admin account"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
