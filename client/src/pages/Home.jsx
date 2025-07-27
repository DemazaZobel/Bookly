import React, { useEffect, useState } from "react";
import API from "../services/api";
import defaultBook from "../assets/default.png";
import { useNavigate } from "react-router-dom";
import AddEditBook from "./AddEditBook";
import { FaUserCircle } from "react-icons/fa";


const Home = () => {
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get("/home");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
  
    const loadUserRole = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const roleId = user?.roleId || null;
        setUserRole(roleId);
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
      }
    };
  
    fetchBooks();
    loadUserRole();
  }, []);
  
  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await API.delete(`/books/${id}`);
        alert("Book deleted successfully.");
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("An error occurred while deleting the book.");
      }
    }
  };
  
  
  

  return (
    <>
    <header className="bg-blue-800 text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      <h1 className="text-2xl font-bold">Bookly</h1>

      <div className="flex flex-col sm:flex-row items-center w-full md:w-auto">
        <input
          type="text"
          placeholder="Search for books..."
          className="w-full sm:w-64 md:w-80 p-2 rounded border border-gray-300 text-black focus:outline-none focus:border-blue-500"
        />
        <button className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
        {userRole === 1 && (
          <button
            className="mt-2 sm:mt-0 sm:ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => navigate("/books/add")}
          >
            Add Book
          </button>
        )}
      </div>

      {/* Profile Icon */}
      <div
        onClick={() => {
          if (userRole === 1) {
            navigate('/admin/profile');
          } else {
            navigate('/user/profile');
          }
        }}
        className="cursor-pointer ml-4 text-white hover:text-gray-300"
        title={userRole === 1 ? 'Admin Profile' : 'User Profile'}
      >
        <FaUserCircle size={32} />
      </div>
     
    </header>

    <div className="m-5 bg-grey-500 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
       {books.map((book,index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 ">        
         <img
          src={`http://localhost:3001${book.image}`}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = defaultBook;
          }}
          alt={book.title || "Book Cover"}
          className="w-full h-[500px] rounded"
        />

          <h2 className="text-xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-700 mb-2">Author: {book.author}</p>
          <p className="text-gray-500 mb-2">Category: {book.categoryName || "Uncategorized"}</p>
          <p className="text-gray-600 mb-4">{book.description}</p>
          <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
          ${parseFloat(book.price).toFixed(2)}
        </span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(book.averageRating))}</span>
              <span className="text-gray-500">{book.reviewCount} Reviews </span>
            </div>
       


          </div>
         <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate(`/books/${book.id}`)}
        >
          View Details
        </button>
        {userRole === 1 && (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => navigate(`/admin/books/edit/${book.id}`)}
            >
              ✏️ Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => handleDeleteBook(book.id)}
            >
              Delete
            </button>
          </>
        )}
                </div>
        </div>
      ))}
      
    </div>
    
    </>
  );
};

export default Home;
