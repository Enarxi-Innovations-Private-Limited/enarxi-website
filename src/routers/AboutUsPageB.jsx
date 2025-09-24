import React from 'react';
import { 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Lightbulb, 
  Award,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

function Aboutusb() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            About Enarxi
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Enarxi Innovations Pvt Ltd was established in 2021, but the vision for innovation began much earlier in 2017. 
                Founded by visionaries <strong className="text-blue-600">Mr. Syed Sameeullah</strong> and <strong className="text-blue-600">Mr. Ayaz Shaik</strong>, 
                two passionate individuals who shared a common dream of revolutionizing the technology landscape.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                What started as a shared passion between a senior and junior has evolved into a company driven by innovation. 
                Our founders believe that advanced technology should be accessible to everyone, and that's exactly what drives 
                Enarxi's multidisciplinary approach to creating solutions that transform ideas into tangible achievements.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are a team of dreamers who accomplish and grow, constantly pushing boundaries because at Enarxi, 
                <em className="text-blue-600 font-medium"> we know no limits</em>.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-xl p-8 transform -rotate-6 shadow-lg">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Lightbulb className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Innovation</h3>
                      <p className="text-gray-600">Transforming ideas into reality since 2017</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower businesses of all sizes to maximize their growth potential and revenue by adapting quickly 
                to market changes and increasing customer loyalty through innovative technology solutions and strategic partnerships.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the global leader in accessible technology innovation, breaking down barriers and making 
                advanced solutions available to everyone, regardless of their size or industry, while maintaining 
                our core values of integrity and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">Meet the visionaries behind Enarxi's success</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr. Syed Sameeullah</h3>
                <p className="text-blue-600 font-semibold mb-4">CEO & Co-Founder</p>
                <p className="text-gray-600 leading-relaxed">
                  Visionary leader with extensive experience in technology innovation and business strategy. 
                  Drives the company's mission to make advanced technology accessible to all.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr. Ayaz Shaik</h3>
                <p className="text-purple-600 font-semibold mb-4">CTO & Co-Founder</p>
                <p className="text-gray-600 leading-relaxed">
                  Technical mastermind behind Enarxi's innovative solutions. Leads the development team with 
                  a focus on cutting-edge technology and user-centric design principles.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Innovation Team</h3>
                <p className="text-green-600 font-semibold mb-4">Core Development</p>
                <p className="text-gray-600 leading-relaxed">
                  Our talented team of developers, designers, and innovators who work tirelessly to bring 
                  groundbreaking solutions to life and exceed client expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="text-center p-8 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly explore new technologies and methods to bring better solutions to our clients.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center p-8 bg-gradient-to-b from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest ethical standards in all our business practices and relationships.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center p-8 bg-gradient-to-b from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Passion</h3>
              <p className="text-gray-600 leading-relaxed">
                Our genuine enthusiasm for technology drives us to deliver exceptional results every time.
              </p>
            </div>

            {/* Value 4 */}
            <div className="text-center p-8 bg-gradient-to-b from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for perfection in every project, ensuring quality that exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Work Together?</h2>
          <p className="text-xl mb-12 text-gray-300">
            Let's discuss how we can help transform your business with innovative solutions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-4">
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="text-lg">contact@enarxi.com</span>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Phone className="w-6 h-6 text-blue-400" />
              <span className="text-lg">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-lg">Innovation Hub, Tech City</span>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get In Touch
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Enarxi Innovations Pvt Ltd. All rights reserved. | Transforming ideas into reality since 2017.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Aboutusb;