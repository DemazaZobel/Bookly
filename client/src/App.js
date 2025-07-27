import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import AddEditBook from './pages/AddEditBook.jsx';
import ManageUsers from "./pages/ManageUsers.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import UserProfileEdit from "./pages/UserProfileEdit.jsx";
import AddUser from "./pages/AddUser.jsx";

// Helper to get user info from localStorage (adjust if needed)
const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch {
    return null;
  }
};

// Protect route for logged-in users (any role)
const ProtectedRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protect admin-only routes
const AdminRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.roleId !== 1) return <Navigate to="/home" replace />; // redirect normal users away
  return children;
};

// Protect user-only routes (non-admin)
const UserOnlyRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.roleId === 1) return <Navigate to="/admin/profile" replace />; // redirect admins away
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/books/add"
          element={
            <AdminRoute>
              <AddEditBook isEdit={false} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books/edit/:id"
          element={
            <AdminRoute>
              <AddEditBook isEdit={true} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/add"
          element={
            <AdminRoute>
              <AddUser />
            </AdminRoute>
          }
        />
        

        {/* User-only routes */}
        <Route
          path="/user/profile"
          element={
            <UserOnlyRoute>
              <UserProfileEdit />
            </UserOnlyRoute>
          }
        />

        {/* Catch all unknown routes - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
