import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import enarxiLogoWhite from "../../assets/images/logo-white.svg";

const Footer = () => {
  return (
    <footer className="flex flex-col w-full mx-auto px-6 py-2 mt-12 md:mt-16 bg-footer-background text-footer-foreground">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6 mb-12 md:justify-items-center items-start">
        {/* image Section */}
        <div className="mb-4">
          <img
            src={enarxiLogoWhite}
            alt="Enarxi Logo"
            className="h-12 md:h-15"
          />
        </div>

        {/* Office Section */}
        <div className="ml-3">
          <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide">
            OFFICE
          </h3>
          <div className="text-footer-foreground space-y-2">
            <p>Enarxi Innovations Pvt Ltd,</p>
            <p>No: 23, Ground Floor, 1st cross street, Sripuram colony, Viralur</p>
            <p>St.thomas Mount</p>
            <p>Chennai, Tamil Nadu 600016</p>
          </div>
        </div>

        {/* Contact and Social Section */}
        <div className="lg:col-span-1 space-y-8 ml-3">
          {/* Contact Us */}
          <div>
            <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide ">
              CONTACT US
            </h3>
            <div className="space-y-3 ">
              <p className="text-footer-foreground">+91-9600676639</p>
              <p className="text-footer-foreground">info@enarxi.com</p>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide ">
              FOLLOW US ON
            </h3>
            <div className="flex space-x-4 text-center lg:text-left">
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Phone className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-footer-border mb-8"></div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center text-footer-muted text-sm">
        <p>© 2025 Enarxi Group. All Rights Reserved</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="#"
            className="hover:text-footer-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-footer-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
