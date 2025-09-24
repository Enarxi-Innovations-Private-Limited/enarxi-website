import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./routers/Hero";
import Services from "./routers/Services"; // Import services page
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Testimonials from "./routers/Testimonials";
import Blog from "./routers/Blog";
import Gallery from "./routers/Gallery";
import AboutUs from "./routers/AboutUs";
import ScrolltoTop from "./scrolltoTop";
import HeroSectionNew from "./components/newHero/HeroSectionNew";
import HeroHeader from "./components/newHero/HeroHeader";
import AboutUs1 from "@components/new/Aboutus";
import FooterNew from "./components/newHero/FooterNew";
import AdminPortal from "./routers/AdminPortal";
import FeedBack from "./routers/FeedBack";

function App() {
  return (
    <Router>
      <ScrolltoTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* <HeroHeader /> */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/newHero" element={<HeroSectionNew />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/aboutus1" element={<AboutUs1 />} />
            <Route path="/feedback" element={<FeedBack />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
