import { useEffect } from "react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Hero from "./pages/Hero";
import Services from "./pages/Services";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import AboutUs from "./pages/AboutUs";
import AboutUs1 from "@components/new/Aboutus";
import AdminPortal from "./pages/admin/AdminPortal";
import AdminBlogDetail from "./pages/admin/AdminBlogDetail";
import FeedBack from "./pages/FeedBack";
import TestSupa from "./pages/client/TestSupa";

import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import StaffProtectedRoute from "./pages/admin/StaffProtectedRoute";
import Login from "./pages/admin/Login";
import StaffLogin from "./pages/admin/StaffLogin";
import StaffPortal from "./pages/staff/StaffPortal";
import UserProfile from "./pages/UserProfile";
import AppLogger from "./AppLogger";
import Logout from "./pages/admin/Logout";
import ErrorBoundary from "./pages/ErrorBoundary";
import OfflineIndicator from "./components/ui/OfflineIndicator";
import StaffBlogEdit from "./pages/staff/StaffBlogEdit";

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
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppLogger />
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
                <Route path="/staff/blogs/:blogId/edit" element={<StaffProtectedRoute><StaffBlogEdit /></StaffProtectedRoute>} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
