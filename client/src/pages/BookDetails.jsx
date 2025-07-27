import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api"; // axios instance

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Decode token to get user info including role
  const token = localStorage.getItem("token");
  let userId = null;
  let isAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.id;
      isAdmin = payload.roleId === 1;  // Assuming roleId 1 is admin
    } catch (e) {
      // invalid token
    }
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookRes = await API.get(`/books/${id}`);
        setBook(bookRes.data);
        console.log(JSON.stringify(bookRes.data, null, 2));
        const reviewRes = await API.get(`/books/${id}/reviews`);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Error fetching book or reviews", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!token) {
      if (window.confirm("You must be logged in to submit a review. Go to login?")) {
        navigate("/login");
      }
      return;
    }

    try {
      await API.post(`/books/${id}/reviews`, {
        rating: newRating,
        comment: newComment,
      });

      const reviewRes = await API.get(`/books/${id}/reviews`);
      setReviews(reviewRes.data);
      setNewRating(5);
      setNewComment("");
    } catch (error) {
      alert("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch {
      alert("Failed to delete review.");
    }
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await API.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });

      const updated = await API.get(`/books/${id}/reviews`);
      setReviews(updated.data);
      setEditingId(null);
    } catch {
      alert("Failed to update review.");
    }
  };

  if (!book) return <div className="text-center mt-10">Loading book...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <img
  src={`http://localhost:3001/${book.image}`}
  alt={book.title}
  className="w-full h-64 object-cover mb-4 rounded"
/>

      <p className="text-lg mb-2 text-gray-700">{book.description}</p>
      <p className="text-sm text-gray-500">Category: {book.category}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map((rev) => {
            const userName = rev.User?.name || "Anonymous";
            const firstLetter = userName.charAt(0).toUpperCase();
            const isOwner = rev.userId === userId;

            return (
              <div key={rev.id} className="border rounded p-3 mb-3 flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                  {firstLetter}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{userName}</p>

                  {editingId === rev.id ? (
                    <>
                      <div className="mb-2">
                        <label className="mr-2">Rating:</label>
                        <select
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="border p-1 rounded"
                        >
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full border p-2 mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateReview(rev.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 border rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Rating:</strong> {"★".repeat(rev.rating)}</p>
                      <p><strong>Comment:</strong> {rev.comment || "No comment"}</p>

                      {(isOwner || isAdmin) && (
                        <div className="mt-2 flex gap-3 text-sm text-blue-600">
                          {isOwner && (
                            <button
                              onClick={() => {
                                setEditingId(rev.id);
                                setEditRating(rev.rating);
                                setEditComment(rev.comment);
                              }}
                              className="hover:underline"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Leave a Review</h2>
        <div className="mb-2">
          <label className="block mb-1">Rating</label>
          <select
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Comment</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          onClick={handleSubmitReview}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
