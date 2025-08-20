import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import enarxiwhiteLogo from "../assets/images/logo-white.svg";

const Footer = () => {
  return (
    <footer className="bg-footer-background text-footer-foreground px-5">
      <div className="container mx-auto px-6 py-2   ">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6 mb-12 justify-items-center">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              {/* <h2 className="text-footer-brand text-2xl font-bold tracking-wider mb-2">
                ENARXI
              </h2> */}
              <img
                src={enarxiwhiteLogo}
                alt="Enarxi Logo"
                className="h-12 md:h-15"
              />
              {/* <p className="text-footer-muted text-sm tracking-wide">
                INNOVATIONS PRIVATE LIMITED
              </p> */}
            </div>
          </div>

          {/* Office Section */}
          <div className="lg:col-span-1">
            <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide">
              OFFICE
            </h3>
            <div className="text-footer-foreground space-y-2">
              <p>Enarxi Innovations Pvt Ltd,</p>
              <p>18/2, 2nd floor, Valluvan St,</p>
              <p>Purasaiwakkam,</p>
              <p>Chennai, Tamil Nadu 600007</p>
            </div>
          </div>

          {/* Contact and Social Section */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Us */}
            <div>
              <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide">
                CONTACT US
              </h3>
              <div className="space-y-3">
                <p className="text-footer-foreground">+91-9600676639</p>
                <p className="text-footer-foreground">info@enarxi.com</p>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-footer-brand text-lg font-semibold mb-6 tracking-wide">
                FOLLOW US ON
              </h3>
              <div className="flex space-x-4">
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
          <p>© 2021 Enarxi Group. All Rights Reserved</p>
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
      </div>
    </footer>
  );
};

export default Footer;
