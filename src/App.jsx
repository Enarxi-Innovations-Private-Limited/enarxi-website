import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./routers/Services"; // Import services page
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Testimonials from "./routers/Testimonials";
import Blog from "./routers/Blog";
import Gallery from "./routers/Gallery";
import AboutUs from "./routers/AboutUs";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
