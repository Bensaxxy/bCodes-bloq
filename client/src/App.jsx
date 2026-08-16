import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import { ToastContainer, toast } from "react-toastify";
import Profile from "./pages/Profile";
import Categories from "./pages/categories/Categories";
import CategoryDetails from "./pages/categories/CategoryDetails";
import Posts from "./pages/posts/Posts";
import PostDetails from "./pages/posts/PostDetails";
import CreatePost from "./pages/posts/CreatePost";
import EditPost from "./pages/posts/EditPost";
import MyPosts from "./pages/posts/MyPosts";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminPosts from "./pages/Admin/AdminPosts";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminComments from "./pages/Admin/AdminComments";
import PublicProfile from "./pages/PublicProfile";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:userId" element={<PublicProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetails />} />

        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<PostDetails />} />

        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/edit/:id" element={<EditPost />} />

        <Route path="/my-posts" element={<MyPosts />} />

        {/* ADMIN ROUTES */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />

            <Route path="posts" element={<AdminPosts />} />

            <Route path="categories" element={<AdminCategories />} />

            <Route path="comments" element={<AdminComments />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
