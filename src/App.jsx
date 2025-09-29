import Footer from "./routers/Components/Footer";
import Header from "./routers/Components/Header";
import Hero from "./routers/Hero";
import Services from "./routers/Services";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Testimonials from "./routers/Testimonials";
import Blog from "./routers/Blog";
import Gallery from "./routers/Gallery";
import AboutUs from "./routers/AboutUs";
import ScrolltoTop from "./scrolltoTop";
import AdminPortal from "./routers/AdminPortal";
import FeedBack from "./routers/FeedBack";

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
    <Router>
      <ScrolltoTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Hero />} /> {/* //total hero component  */}
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/feedback" element={<FeedBack />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPortal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
