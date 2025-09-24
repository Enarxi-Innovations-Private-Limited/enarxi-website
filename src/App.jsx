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

// Main layout with header + footer
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

// Admin layout without header/footer
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
    <Router>
      <ScrolltoTop />
      <Routes>
        {/* Routes using the MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/newHero" element={<HeroSectionNew />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/aboutus1" element={<AboutUs1 />} />
          <Route path="/feedback" element={<FeedBack />} />
        </Route>

        {/* Routes using the AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPortal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
