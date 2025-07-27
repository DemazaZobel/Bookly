import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    id: null,
    bookTitle: "",
    reviewerName: "",
    reviewText: "",
    rating: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/reviews");
      setReviews(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create or update a review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        // Update existing review
        await axios.put(`/reviews/${form.id}`, form);
      } else {
        // Create new review
        await axios.post("/reviews", form);
      }
      setForm({ id: null, bookTitle: "", reviewerName: "", reviewText: "", rating: 1 });
      setIsEditing(false);
      fetchReviews();
      setError("");
    } catch (err) {
      setError("Failed to save review.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare form for editing a review
  const handleEdit = (review) => {
    setForm(review);
    setIsEditing(true);
  };

  // Delete a review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    try {
      await axios.delete(`/reviews/${id}`);
      fetchReviews();
      setError("");
    } catch (err) {
      setError("Failed to delete review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Admin Dashboard - Book Reviews</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <h2>{isEditing ? "Edit Review" : "Add New Review"}</h2>
        <input
          name="bookTitle"
          value={form.bookTitle}
          onChange={handleChange}
          placeholder="Book Title"
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          name="reviewerName"
          value={form.reviewerName}
          onChange={handleChange}
          placeholder="Reviewer Name"
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <textarea
          name="reviewText"
          value={form.reviewText}
          onChange={handleChange}
          placeholder="Review Text"
          required
          rows={4}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <label>
          Rating: 
          <select name="rating" value={form.rating} onChange={handleChange} style={{ marginLeft: 10 }}>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {isEditing ? "Update Review" : "Add Review"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setForm({ id: null, bookTitle: "", reviewerName: "", reviewText: "", rating: 1 });
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>All Reviews</h2>
      {reviews.length === 0 && <p>No reviews found.</p>}
      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Reviewer</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.bookTitle}</td>
              <td>{r.reviewerName}</td>
              <td>{r.reviewText}</td>
              <td>{r.rating}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>{" "}
                <button onClick={() => handleDelete(r.id)} style={{ color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
