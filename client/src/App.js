import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BlogCreate from "./pages/BlogCreate";
import BlogDetail from "./pages/BlogDetail";
import EditBlog from "./pages/EditBlog"; // <-- import your EditBlog page
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import { getUser } from "./utils/auth";


function AnimatedRoutes() {
  const location = useLocation();
  const user = getUser();

  return (
    <>
      {user && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {!user ? (
            <>
              <Route
                path="/login"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <Login />
                  </motion.div>
                }
              />
              <Route
                path="/register"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <Register />
                  </motion.div>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <BlogCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/search" element={<SearchResults />} />
              
            </>
          )}
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <main className="container">
        <AnimatedRoutes />
      </main>
    </Router>
  );
}
