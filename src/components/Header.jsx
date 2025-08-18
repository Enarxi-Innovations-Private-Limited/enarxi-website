import { useState } from "react";

import enarxiLogo from "../assets/images/image.png";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    dropdown: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "App Development", href: "/services/app-development" },
      { label: "AI Solutions", href: "/services/ai-solutions" },
    ],
  },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <header className=" bg-white shadow-sm ">
      <div className="flex items-center justify-between py-4 mx-auto w-[90%]">
        {/* Logo */}
        <a href="/" aria-label="Enarxi Home">
          <img
            src={enarxiLogo}
            alt="Enarxi Logo"
            className="h-10 w-auto"
            loading="lazy"
          />
        </a>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-8 font-semibold text-black uppercase tracking-wide">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {!item.dropdown ? (
                  <a
                    href={item.href}
                    className="hover:text-[#09B8DC] transition"
                  >
                    {item.label}
                  </a>
                ) : (
                  <>
                    <div className="flex items-center space-x-1 hover:text-[#09B8DC] transition">
                      <span>{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                    {hoveredItem === item.label && (
                      <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md overflow-hidden min-w-[180px] z-50">
                        {item.dropdown.map((sub) => (
                          <li key={sub.label}>
                            <a
                              href={sub.href}
                              className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <button
          type="button"
          className="text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300"
        >
          Let’s Connect
        </button>
      </div>
    </header>
  );
}

// import { useState } from "react";
// import enarxiLogo from "../assets/images/image.png";

// const navItems = [
//   { label: "Home", href: "/" },
//   {
//     label: "Services",
//     dropdown: [
//       { label: "Web Development", href: "/services/web-development" },
//       { label: "App Development", href: "/services/app-development" },
//       { label: "AI Solutions", href: "/services/ai-solutions" },
//     ],
//   },
//   { label: "Testimonials", href: "/testimonials" },
//   { label: "Blogs", href: "/blogs" },
//   { label: "Gallery", href: "/gallery" },
//   { label: "About Us", href: "/about" },
// ];

// export default function Header() {
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-sm">
//       <div className="flex items-center justify-between py-4 mx-auto w-[90%] md:flex-row flex-col md:gap-4">
//         <div className="flex items-center justify-between w-full md:w-auto">
//           <a href="/" aria-label="Enarxi Home">
//             <img
//               src={enarxiLogo}
//               alt="Enarxi Logo"
//               className="h-10 w-auto"
//               loading="lazy"
//             />
//           </a>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden text-gray-800"
//             aria-label="Toggle navigation menu"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-8"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//               />
//             </svg>
//           </button>
//         </div>

//         <div
//           className={`w-full md:w-auto md:flex md:items-center md:space-x-8 ${
//             isMenuOpen ? "block" : "hidden"
//           } mt-4 md:mt-0 transition-all duration-300 ease-in-out md:flex-grow md:justify-center`}
//         >
//           <nav className="mb-4 md:mb-0">
//             <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 md:space-y-0 space-y-4 font-semibold text-black uppercase tracking-wide">
//               {navItems.map((item) => (
//                 <li
//                   key={item.label}
//                   className="relative"
//                   // Keep onMouseEnter and onMouseLeave here on the parent <li>
//                   onMouseEnter={() => setHoveredItem(item.label)}
//                   onMouseLeave={() => setHoveredItem(null)}
//                 >
//                   {!item.dropdown ? (
//                     <a
//                       href={item.href}
//                       className="hover:text-[#09B8DC] transition"
//                     >
//                       {item.label}
//                     </a>
//                   ) : (
//                     <>
//                       <div className="flex items-center space-x-1 hover:text-[#09B8DC] transition cursor-pointer">
//                         <span>{item.label}</span>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="currentColor"
//                           className="size-6"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="m19.5 8.25-7.5 7.5-7.5-7.5"
//                           />
//                         </svg>
//                       </div>
//                       {/* Dropdown menu is rendered inside the same li element */}
//                       {hoveredItem === item.label && (
//                         <ul className="md:absolute md:left-0 md:top-full md:mt-2 bg-white shadow-lg rounded-md overflow-hidden min-w-[180px] z-50 mt-2">
//                           {item.dropdown.map((sub) => (
//                             <li key={sub.label}>
//                               <a
//                                 href={sub.href}
//                                 className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
//                               >
//                                 {sub.label}
//                               </a>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <button
//             type="button"
//             className="w-full md:w-auto text-white bg-[#09B8DC] rounded-full px-6 py-2.5 hover:bg-[#08A0C6] transition duration-300"
//           >
//             Let’s Connect
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }
