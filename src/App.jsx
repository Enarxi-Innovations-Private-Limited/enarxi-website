import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./routers/Hero";
import Services from "./routers/Services";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Testimonials from "./routers/Testimonials";
import Blog from "./routers/Blog";
import Gallery from "./routers/Gallery";
import AboutUs from "./routers/AboutUs";
import ScrolltoTop from "./scrolltoTop";
import HeroSectionNew from "./components/newHero/HeroSectionNew";
import AboutUs1 from "@components/new/Aboutus";
import AdminPortal from "./routers/AdminPortal";
import FeedBack from "./routers/FeedBack";
import TestSupa from "@components/new/TestSupa";

import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import StaffProtectedRoute from "./StaffProtectedRoute"; // Import the new protected route
import Login from "./Login";
import StaffLogin from "./StaffLogin"; // Import the new login page
import StaffPortal from "./routers/StaffPortal"; // Import the new portal
import AppLogger from "./AppLogger";
import Logout from "./Logout";

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
<AuthProvider>
    <Router>
      <AppLogger/>
      <ScrolltoTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/newHero" element={<HeroSectionNew />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/aboutus" element={<AboutUs1 />} />
          <Route path="/feedback" element={<FeedBack />} />
        </Route>
    
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPortal /></ProtectedRoute>} />
          <Route path="/user" element={<TestSupa />} />
                    <Route path="/login" element={<Login />} />
          <Route path="/stafflogin" element={<StaffLogin />} />
          <Route path="/staff" element={<StaffProtectedRoute><StaffPortal /></StaffProtectedRoute>} />
          <Route path="/logout" element={<Logout/>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
