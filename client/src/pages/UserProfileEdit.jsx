import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const UserProfileEdit = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/user/profile')
      .then(res => {
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',
          confirmPassword: '',
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (profile.password && profile.password !== profile.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
      };
      if (profile.password) updateData.password = profile.password;

      await API.put('/user/profile', updateData);
      setSuccess('Profile updated successfully!');
      setProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch {
      setError('Update failed');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmed) return;

    try {
      await API.delete('/user/profile');
      localStorage.removeItem('token');
      handleLogout();
      setSuccess('Account deleted successfully');
    } catch (err) {
      setError('Account deletion failed');
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

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-6 font-semibold">Edit Profile</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">New Password (optional)</label>
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={profile.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
      >
        Logout
      </button>

      <button
        type="button"
        onClick={handleDeleteAccount}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default UserProfileEdit;
