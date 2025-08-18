import heroImage from "../assets/heroImage.svg";

const Hero = () => {
  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
      {/* text */}
      <p className="text-[#1840A7]  capitalize text-[24px] font-noto">
        Don't just dream it, build it
      </p>
      <h1 className=" font-semibold text-[#0A1524] max-w-4xl text-2xl md:text-[34px] font-poppins leading-snug capitalize">
        Your imagination knows no bounds. Let's make something amazing together!
      </h1>

      <div className="mt-6">
        <button className="bg-[#0A1524] text-white px-8 py-3 rounded-full shadow transition flex items-center gap-2 cursor-pointer">
          Explore →
        </button>
      </div>

      {/* image */}
      <div className="mt-10 w-full flex justify-center cursor- ">
        <img src={heroImage} alt="heroImage" className="w-1/4 h-auto " />
      </div>
    </div>
  );
};

export default Hero;
