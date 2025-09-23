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
import HeroSectionNew from "./components/farmui/HeroSectionNew";
import HeroHeader from "./components/farmui/HeroHeader";
import NewAboutUs from "@components/NewAboutus";
import FooterNew from "./components/farmui/FooterNew";

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
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/newHero" element={<HeroSectionNew />} />
            <Route path="/newAbout" element={<NewAboutUs />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
