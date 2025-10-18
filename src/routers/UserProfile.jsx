import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Calendar, Linkedin, MapPin } from "lucide-react";

// TODO: Fetch user details by username from API
const mockUser = {
  name: "Syed Ahmed Bin sulaiman bin sultann",
  email: "syed@enarxi.com",
  joinedDate: "2024-03-15",
  location: "Bangalore, India",
  linkedin: "https://linkedin.com/in/syedahmed",
  profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "I am passionate about electronics and IoT. I love creating innovative projects that blend hardware and software to solve real-world problems. Whether it's a gift for family, a surprise for friends, or something useful for the community, I enjoy crafting things that bring joy and spark curiosity.",
  stats: {
    blogs: 28,
    views: 20836,
  },
  blogs: [
    {
      id: 1,
      title: "The Future of AI in Edge Devices",
      thumbnail: "https://picsum.photos/seed/ai-edge/400/250",
      description:
        "Exploring how AI models are optimized for on-device performance and real-time inference.",
      views: 320,
      published: "June 14, 2024",
    },
    {
      id: 2,
      title: "Building a Smart Home with ESP32",
      thumbnail: "https://picsum.photos/seed/smart-home/400/250",
      description:
        "A comprehensive guide to creating an IoT-based smart home automation system.",
      views: 542,
      published: "May 22, 2024",
    },
    {
      id: 3,
      title: "PCB Design Best Practices",
      thumbnail: "https://picsum.photos/seed/pcb-design/400/250",
      description:
        "Learn the essential principles for designing efficient and reliable printed circuit boards.",
      views: 789,
      published: "April 18, 2024",
    },
    {
      id: 4,
      title: "3D Printing for Rapid Prototyping",
      thumbnail: "https://picsum.photos/seed/3d-printing/400/250",
      description:
        "How to leverage 3D printing technology to accelerate your product development cycle.",
      views: 456,
      published: "March 30, 2024",
    },
    {
      id: 5,
      title: "Introduction to MQTT Protocol",
      thumbnail: "https://picsum.photos/seed/mqtt-protocol/400/250",
      description:
        "Understanding the lightweight messaging protocol for IoT applications.",
      views: 612,
      published: "March 10, 2024",
    },
    {
      id: 6,
      title: "Wireless Sensor Networks Explained",
      thumbnail: "https://picsum.photos/seed/sensor-networks/400/250",
      description:
        "Deep dive into the architecture and applications of wireless sensor networks.",
      views: 398,
      published: "February 25, 2024",
    },
    {
      id: 7,
      title: "Arduino vs Raspberry Pi: Which to Choose?",
      thumbnail: "https://picsum.photos/seed/arduino-rpi/400/250",
      description:
        "A detailed comparison to help you choose the right platform for your project.",
      views: 891,
      published: "February 12, 2024",
    },
    {
      id: 8,
      title: "Battery Management Systems for IoT",
      thumbnail: "https://picsum.photos/seed/battery-iot/400/250",
      description:
        "Essential techniques for optimizing battery life in IoT devices.",
      views: 523,
      published: "January 28, 2024",
    },
  ],
};

export default function UserProfile() {
  const { username } = useParams(); // Get username from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchUserData = async () => {
    //   const response = await fetch(`/api/users/${username}`);
    //   const data = await response.json();
    //   setUser(data);
    // };

    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, [username]);

  if (loading) {
    return (
      <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="w-[90%] max-w-7xl mx-auto py-12 min-h-[60vh]">
      {/* Profile Section with Blue Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-[#dff4ff] to-white rounded-xl shadow-sm p-8 mb-12"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex-shrink-0"
          >
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
            />
          </motion.div>

          {/* User Details Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex lg:min-w-[30vh] flex-col"
          >
            {/* Name */}
            <h1 className="text-4xl  md:text-5xl/12  font-bold font-oswald text-gray-900 mb-3">
              {user.name}
            </h1>

            {/* Email */}
            <p className="text-base text-gray-600 mb-2 font-poppins">
              {user.email}
            </p>

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin size={16} />
                <span className="font-poppins">{user.location}</span>
              </div>
            )}

            {/* Joined Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar size={16} />
              <span className="font-poppins">
                Joined on{" "}
                {new Date(user.joinedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* LinkedIn Link */}
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium text-sm"
            >
              <Linkedin size={18} />
              <span className="font-poppins">Connect on LinkedIn</span>
            </a>
          </motion.div>

          {/* Vertical Separator */}
          <div className="hidden md:block w-px bg-gray-300 self-stretch mx-4"></div>

          {/* Stats Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            {/* Blogs & Views Row */}
            <div className="flex flex-row justify-evenly md:mb-5  gap-12 items-center">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-4xl font-bold font-oswald text-gray-900">
                  {user.stats.blogs}
                </p>
                <p className="text-sm text-gray-600 font-poppins">Blogs</p>
              </div>
              <div className="hidden md:block w-px bg-gray-300 self-stretch mx-4"></div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-4xl font-bold font-oswald text-gray-900">
                  {user.stats.views.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 font-poppins">Views</p>
              </div>
            </div>

            {/* Bio Below */}
            {user.bio && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="border-t border-gray-200 pt-4"
              >
                <p className="text-sm text-gray-700 leading-relaxed font-poppins max-w-4xl">
                  {user.bio}
                </p>
              </motion.div>
            )}
          </motion.div> 
        </div>
      </motion.div>

      {/* Blogs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900 mb-8">
          Blogs by {user.name.split(" ")[0]}
        </h2>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
            >
              {/* Blog Thumbnail */}
              <div className="w-full aspect-video overflow-hidden">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Blog Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-base font-semibold font-oswald text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 font-poppins">
                  {blog.description}
                </p>

                {/* Footer - Views and Date */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span className="font-poppins">{blog.views}</span>
                  </div>
                  <span className="font-poppins">{blog.published}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {user.blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-poppins">
              No blogs published yet.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
