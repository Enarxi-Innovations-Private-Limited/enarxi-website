import { useState, useEffect } from "react";
import { X } from "lucide-react";

import blog_1 from "../assets/images/blog-1.svg";
import blog_2 from "../assets/images/blog-2.svg";
import blog_3 from "../assets/images/blog-3.svg";
import blog_4 from "../assets/images/blog-4.svg";
import blog_5 from "../assets/images/blog-5.svg";
import blog_6 from "../assets/images/blog-6.svg";

export default function Blog() {
  const [selected, setSelected] = useState(null);

  // Lock/unlock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [selected]);

  const blogs = [
    {
      img: blog_1,
      title: "Integer Maecenas Eget Viverra.",
      desc: "ENARX’s Team Of Qualified PCB Designers And Fabricators Perform Swift And Dense Multilayer Layouts For Your Printed Circuit Boards. We Understand The Complex Demands Of The Market, Which Inspires Us To Provide You With Top–Notch Designs Linking To The Best Standards Of Practice And Quality.",
      date: "June 21,2022",
    },
    {
      img: blog_2,
      title: "Integer Maecenas Eget Viverra.",
      desc: "Detailed description for blog 2 goes here. You can expand with more content if needed.",
      date: "June 21,2022",
    },
    {
      img: blog_3,
      title: "Integer Maecenas Eget Viverra.",
      desc: "Detailed description for blog 3 goes here. You can expand with more content if needed.",
      date: "June 21,2022",
    },
    {
      img: blog_4,
      title: "Integer Maecenas Eget Viverra.",
      desc: "Detailed description for blog 4 goes here. You can expand with more content if needed.",
      date: "June 21,2022",
    },
    {
      img: blog_5,
      title: "Integer Maecenas Eget Viverra.",
      desc: "Detailed description for blog 5 goes here. You can expand with more content if needed.",
      date: "June 21,2022",
    },
    {
      img: blog_6,
      title: "Integer Maecenas Eget Viverra.",
      desc: "Detailed description for blog 6 goes here. You can expand with more content if needed.",
      date: "June 21,2022",
    },
  ];

  return (
    <section className="w-[90%] mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold font-oswald">Our Blogs</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {blog.desc.slice(0, 50)}...
              </p>
              <p className="text-xs text-gray-400">{blog.date}</p>
              <button
                onClick={() => setSelected(blog)}
                className="text-sm text-sky-500 font-medium mt-2 cursor-pointer underline"
              >
                View Post
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelected(null)} // close on backdrop click
        >
          <div className="bg-white p-6 rounded-xl w-[60%]">
            <div
              className="bg-white rounded-2xl shadow-xl w-full relative overflow-hidden mx-auto"
              onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-white bg-black/75 p-3 cursor-pointer rounded-full"
              >
                <X size={22} />
              </button>

              <img
                src={selected.img}
                alt={selected.title}
                className="w-full h-60 object-cover"
              />

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-1">{selected.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{selected.date}</p>
                <p className="text-gray-600 leading-relaxed">{selected.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
