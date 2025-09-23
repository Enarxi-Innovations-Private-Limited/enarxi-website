import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Menu, Twitter, Linkedin, Facebook, Instagram, Target, Eye, Zap, Shield, Users } from "lucide-react";

export default function NewAboutUs() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="bg-[var(--color-bg)] text-white">
      {/* Navigation */}
      <nav className="bg-[var(--color-bg)] border-b border-[var(--color-bg-alt)] fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold gradient-text">ENARXI</span>
              <div className="hidden md:block ml-10 space-x-4">
                <a href="/" className="text-sm font-medium text-gray-300 hover:text-white">Home</a>
                <a href="/about" className="text-sm font-medium bg-[var(--color-bg-alt)] text-white px-3 py-2 rounded-md">About</a>
                <a href="/services" className="text-sm font-medium text-gray-300 hover:text-white">Services</a>
                <a href="/contact" className="text-sm font-medium text-gray-300 hover:text-white">Contact</a>
              </div>
            </div>
            <div className="hidden md:block">
              <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </button>
            </div>
            <div className="md:hidden -mr-2">
              <button className="p-2 rounded-md text-gray-400 hover:text-white">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg-alt)] text-center" data-aos="fade-up">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 gradient-text">Our Story</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-[var(--color-text)]">
          Founded in 2020, Enarxi has been at the forefront of digital innovation, helping businesses transform and thrive in the digital age.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-alt)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-[var(--color-bg)] p-8 rounded-xl shadow-lg" data-aos="fade-right">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-900 bg-opacity-30">
                <Target className="text-[var(--color-primary)] w-6 h-6" />
              </div>
              <h2 className="ml-4 text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-[var(--color-text)]">
              To empower businesses with cutting-edge digital solutions that drive growth, efficiency, and innovation.
            </p>
          </div>

          <div className="bg-[var(--color-bg)] p-8 rounded-xl shadow-lg" data-aos="fade-left">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-900 bg-opacity-30">
                <Eye className="text-[var(--color-primary)] w-6 h-6" />
              </div>
              <h2 className="ml-4 text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-[var(--color-text)]">
              To be the most trusted digital transformation partner worldwide, recognized for innovation, integrity, and results.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Meet Our Team</h2>
          <p className="max-w-2xl mx-auto text-[var(--color-text)]">A diverse group of passionate professionals dedicated to delivering excellence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Alex Johnson", role: "CEO & Founder", desc: "Visionary leader with 15+ years in tech innovation.", img: "http://static.photos/people/400x400/1" },
            { name: "Sarah Williams", role: "CTO", desc: "Tech strategist specializing in scalable architectures.", img: "http://static.photos/people/400x400/2" },
            { name: "Michael Chen", role: "Lead Developer", desc: "Full-stack wizard with a passion for clean code.", img: "http://static.photos/people/400x400/3" },
            { name: "Emily Rodriguez", role: "UX Designer", desc: "Creating intuitive and beautiful user experiences.", img: "http://static.photos/people/400x400/4" }
          ].map((member, i) => (
            <div key={i} className="bg-[var(--color-bg-alt)] rounded-xl overflow-hidden shadow-lg team-card transition duration-300" data-aos="zoom-in" data-aos-delay={i * 100}>
              <img src={member.img} alt={member.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-[var(--color-primary)] mb-4">{member.role}</p>
                <p className="text-[var(--color-text)] text-sm">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-alt)]">
        <div className="max-w-7xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Our Core Values</h2>
          <p className="max-w-2xl mx-auto text-[var(--color-text)]">The principles that guide everything we do at Enarxi.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-[var(--color-primary)] w-6 h-6" />, title: "Innovation", desc: "We constantly push boundaries to create solutions that redefine what's possible." },
            { icon: <Shield className="text-[var(--color-primary)] w-6 h-6" />, title: "Integrity", desc: "We do what's right, not what's easy. Honesty and transparency guide our actions." },
            { icon: <Users className="text-[var(--color-primary)] w-6 h-6" />, title: "Collaboration", desc: "We believe the best results come from working together with clients and colleagues." }
          ].map((value, i) => (
            <div key={i} className="bg-[var(--color-bg)] p-8 rounded-xl shadow-lg value-card transition duration-300" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-blue-900 bg-opacity-30">{value.icon}</div>
                <h3 className="ml-4 text-xl font-bold">{value.title}</h3>
              </div>
              <p className="text-[var(--color-text)]">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-bg)] border-t border-[var(--color-bg-alt)]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">ENARXI</h3>
            <p className="text-[var(--color-text)] text-sm">Transforming businesses through innovative digital solutions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-[var(--color-text)] hover:text-white">About Us</a></li>
              <li><a href="/careers" className="text-[var(--color-text)] hover:text-white">Careers</a></li>
              <li><a href="/blog" className="text-[var(--color-text)] hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/web" className="text-[var(--color-text)] hover:text-white">Web Development</a></li>
              <li><a href="/apps" className="text-[var(--color-text)] hover:text-white">Mobile Apps</a></li>
              <li><a href="/cloud" className="text-[var(--color-text)] hover:text-white">Cloud Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Twitter className="text-[var(--color-text)] hover:text-white cursor-pointer" />
              <Linkedin className="text-[var(--color-text)] hover:text-white cursor-pointer" />
              <Facebook className="text-[var(--color-text)] hover:text-white cursor-pointer" />
              <Instagram className="text-[var(--color-text)] hover:text-white cursor-pointer" />
            </div>
            <p className="text-[var(--color-text)] text-sm mt-4">info@enarxi.com</p>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm py-6 border-t border-[var(--color-bg-alt)]">
          © 2023 Enarxi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
