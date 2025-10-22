import enarxiLogoWhite from "../../assets/images/logo-white.svg";
import whatsappFooterSVG from "../../assets/icons/whatsappFooterSVG.svg";
import Indicator from "@/indicator";

const Footer = () => {
  return (
    <>
      <Indicator />
      <footer className="w-full bg-footer-background text-footer-foreground mt-12 md:mt-16">
        <div className="max-w-7xl text-poppins mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-12">
          {/* Grid Layout - 3 columns x 3 rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-8 md:gap-y-5 md:justify-items-center">
            
            {/* Row 1, Col 1: Logo - aligned with OFFICE title */}
            <div className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 flex items-start justify-center md:justify-start w-full">
              <img
                src={enarxiLogoWhite}
                alt="Enarxi Logo"
                className="h-12 md:h-14"
              />
            </div>

            {/* Row 2: Horizontal Dividers across all 3 columns */}
            <div className="hidden md:block md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>
            <div className="hidden md:block md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>
            <div className="hidden md:block md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3 w-full self-start">
              <div className="border-t w-full border-gray-500"></div>
            </div>

            {/* Row 3, Col 1: Office Section */}
            <div className="md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand shrink text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                OFFICE
              </h3>
              <address className="not-italic shrink text-footer-foreground space-y-1 text-sm md:text-lg leading-relaxed text-center md:text-left">
                <p>Enarxi Innovations Pvt Ltd,</p>
                <p>18/2, 2nd floor, Valluvan St,</p>
                <p>Purasaiwakkam,</p>
                <p>Chennai, Tamil Nadu 600007</p>
              </address>
            </div>

            {/* Row 3, Col 2: Contact Section */}
            <div className="md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                CONTACT US
              </h3>
              <div className="space-y-2 flex flex-col items-center md:items-start text-sm md:text-lg">
                <a
                  href="tel:+919600676639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors hover:underline"
                  aria-label="Call us at +91 9600676639"
                >
                  +91-9600676639
                </a>
                <a
                  href="mailto:info@enarxi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors hover:underline"
                  aria-label="Email us at info@enarxi.com"
                >
                  info@enarxi.com
                </a>
              </div>
            </div>

            {/* Row 3, Col 3: Follow Us Section */}
            <div className="md:col-start-3 md:col-end-4 md:row-start-3 md:row-end-4 flex flex-col items-center md:items-start w-full self-start">
              <h3 className="text-footer-brand text-md md:text-xl font-semibold mb-3 md:mb-4 tracking-wide">
                FOLLOW US ON
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-[2vw]">
                <a
                  href="https://wa.me/+919600676639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="mailto:contact@enarxi.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Send us an email"
                >
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="tel:+919600676639"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Call us"
                >
                  <Phone className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.instagram.com/enarxi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.facebook.com/enarxitech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/company/enarxi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-footer-foreground hover:text-footer-brand transition-colors"
                  aria-label="Connect with us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright and Links */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-footer-muted text-xs">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} Enarxi Group. All Rights Reserved
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="#"
                className="hover:text-footer-foreground transition-colors"
                aria-label="Read our Terms of Service"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-footer-foreground transition-colors"
                aria-label="Read our Privacy Policy"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
