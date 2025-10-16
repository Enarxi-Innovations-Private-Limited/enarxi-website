import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import enarxiLogoWhite from "../../assets/images/logo-white.svg";
import whatsappFooterSVG from "../../assets/icons/whatsappFooterSVG.svg";

const Footer = () => {
  return (
    <footer className="flex flex-col w-full mx-auto px-4 sm:px-6 py-6 mt-12 md:mt-16 bg-footer-background text-footer-foreground">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6 mb-12 md:justify-items-center items-start text-center md:text-left">
        {/* Logo Section */}
        <div className="mb-6 flex justify-center md:justify-start">
          <img
            src={enarxiLogoWhite}
            alt="Enarxi Logo"
            className="h-10 sm:h-12 md:h-15"
          />
        </div>

        {/* Office Section */}
        <div className="ml-0 md:ml-3">
          <h3 className="text-footer-brand text-lg font-semibold mb-4 tracking-wide">
            OFFICE
          </h3>
          <div className="text-footer-foreground space-y-2 text-sm sm:text-base leading-relaxed">
            <p>Enarxi Innovations Pvt Ltd,</p>
            <p>No: 23, Ground Floor, 1st Cross Street, Sripuram Colony, Viralur</p>
            <p>St. Thomas Mount</p>
            <p>Chennai, Tamil Nadu 600016</p>
          </div>
        </div>

        {/* Contact and Social Section */}
        <div className="lg:col-span-1 space-y-8 ml-0 md:ml-3">
          {/* Contact Us */}
          <div>
            <h3 className="text-footer-brand text-lg font-semibold mb-4 tracking-wide">
              CONTACT US
            </h3>
            <div className="space-y-2 flex flex-col text-sm sm:text-base">
              <a
                href="tel:+91 96006 76639"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground hover:underline"
              >
                +91-9600676639
              </a>
              <a
                href="mailto:info@enarxi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground hover:underline"
              >
                info@enarxi.com
              </a>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-footer-brand text-lg font-semibold mb-4 tracking-wide">
              FOLLOW US ON
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-center">
              <a
                href="https://wa.me/+919600676639"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@enarxi.com"
                rel="noopener noreferrer"
                target="_blank"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="tel:+91 96006 76639"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Phone className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/enarxi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/enarxitech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground hover:text-footer-brand transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/enarxi/"
                target="_blank"
                rel="noopener noreferrer"
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
      <div className="flex flex-col md:flex-row justify-between items-center text-footer-muted text-sm text-center md:text-left">
        <p>© 2025 Enarxi Group. All Rights Reserved</p>
        <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 md:mt-0">
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
