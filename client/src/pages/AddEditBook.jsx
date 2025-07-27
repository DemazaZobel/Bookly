import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const AddEditBook = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

 
  const [previewUrl, setPreviewUrl] = useState('');


  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null); // For file upload
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();

    if (isEdit && id) {
      const fetchBook = async () => {
        try {
          const res = await API.get(`/books/${id}`);
          setBookData({
            title: res.data.title || "",
            author: res.data.author || "",
            description: res.data.description || "",
            price: res.data.price || "",
            categoryId: res.data.categoryId || "",
          });
        } catch (err) {
          setError("Failed to load book data");
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // generate preview URL
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      Object.entries(bookData).forEach(([key, val]) => {
        formData.append(key, val);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = localStorage.getItem("token"); // Get token for auth header
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      if (isEdit) {
        await API.put(`/books/${id}`, formData, config);
        alert("Book updated successfully!");
      } else {
        await API.post("/books", formData, config);
        alert("Book added successfully!");
      }
      navigate("/home");
    } catch (err) {
      setError("Failed to save book. Please try again.");
      console.error(err);
    }
  };
    useEffect(() => {
        return () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        };
    }, [previewUrl]);

    
      
  

  if (loading) return <p>Loading book data...</p>;


  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl mb-6">{isEdit ? "Edit Book" : "Add New Book"}</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <label className="block">
          Title:
          <input
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Author:
          <input
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Description:
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Price:
          <input
            type="number"
            name="price"
            value={bookData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Category:
          <select
            name="categoryId"
            value={bookData.categoryId}
            onChange={handleChange}
            required
            className=""
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category}
              </option>
            ))}
          </select>
        </label>

       
            <div>
                <label htmlFor="image">Upload Book Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {previewUrl && (
                    <div style={{ marginTop: '10px' }}>
                    <p>Preview:</p>
                    <img
                        src={previewUrl}
                        alt="Selected"
                        style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                    />
                    </div>
                )}
            </div>


        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddEditBook;
