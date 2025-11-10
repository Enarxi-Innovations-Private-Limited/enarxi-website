import { useEffect } from "react";
import Footer from "./routers/Components/Footer";
import Header from "./routers/Components/Header";
import Hero from "./routers/Hero";
import Services from "./routers/Services";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Testimonials from "./routers/Testimonials";
import Blog from "./routers/Blog";
import BlogDetail from "./routers/BlogDetail";
import Gallery from "./routers/Gallery";
import AboutUs from "./routers/AboutUs";
import AboutUs1 from "@components/new/Aboutus";
import AdminPortal from "./routers/AdminPortal";
import AdminBlogDetail from "./routers/admin/AdminBlogDetail";
import FeedBack from "./routers/FeedBack";
import TestSupa from "./routers/new/TestSupa";

import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import StaffProtectedRoute from "././routers/admin/StaffProtectedRoute"; // Import the new protected route
import Login from "././routers/admin/Login";
import StaffLogin from "././routers/admin/StaffLogin"; // Import the new login page
import StaffPortal from "./routers/StaffPortal"; // Import the new portal
import StaffBlogDetail from "./routers/staff/StaffBlogDetail"; // Import staff blog detail page
import UserProfile from "./routers/UserProfile"; // Import user profile page
import AppLogger from "./AppLogger";
import Logout from "./routers/admin/Logout";
import ErrorBoundary from "./routers/ErrorBoundary";
import OfflineIndicator from "./components/shared/OfflineIndicator";

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppLogger/>
          <OfflineIndicator />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Hero />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/aboutus" element={<AboutUs1 />} />
              <Route path="/feedback" element={<FeedBack />} />
              <Route path="/users/:username" element={<UserProfile />} />
            </Route>
        
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<ProtectedRoute><AdminPortal /></ProtectedRoute>} />
              <Route path="/admin/blog/:slug" element={<ProtectedRoute><AdminBlogDetail /></ProtectedRoute>} />
              <Route path="/user" element={<TestSupa />} />
              <Route path="/login" element={<Login />} />
              <Route path="/stafflogin" element={<StaffLogin />} />
              <Route path="/staff" element={<StaffProtectedRoute><StaffPortal /></StaffProtectedRoute>} />
              <Route path="/staff/blog/:slug" element={<StaffProtectedRoute><StaffBlogDetail /></StaffProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
