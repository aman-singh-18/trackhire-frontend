import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddInterview from "./pages/AddInterview";
import EditInterview from "./pages/EditInterview";
import ViewInterview from "./pages/ViewInterview";
import Analytics from "./pages/Analytics";
import ManageResumes from "./pages/ManageResumes";

// Import Shared Architecture Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* Global Notification Panel */}
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'bg-slate-900 text-white border border-slate-800 rounded-xl text-sm',
          duration: 4000,
        }}
      />

      <Routes>
        {/* Public Routes (No persistent Sidebar/Navbar layouts needed here) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard App Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* These pages are automatically injected into the Layout's <Outlet /> */}
          <Route path="/" element={<Dashboard />} />
          {/* We will build this page right next */}
          <Route path="/add" element={<AddInterview />} />
          <Route path="/edit/:id" element={<EditInterview />} />
          <Route path="/view/:id" element={<ViewInterview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/resumes" element={<ManageResumes />} />
        </Route>

        {/* Fallback Protection Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;