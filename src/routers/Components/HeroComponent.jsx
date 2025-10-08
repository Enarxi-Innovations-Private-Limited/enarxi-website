import heroVideo from "../../assets/Videos/heroVideo.mp4";

const HeroComponent = () => {
  return (
    <section className="w-full h-[calc(100vh-64px)] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
      <p className="font-noto font-medium leading-[100%] tracking-[0.78px] text-[#1840A7] text-center capitalize text-2xl sm:text-3xl md:text-3xl lg:4xl mb-4 mt-6">
        Don't Just Dream It, Build It
      </p>

      <h1 className="[font-weight:600] text-[#0A1524] max-w-3xl text-lg sm:text-xl md:text-[34px] font-poppins capitalize mb-6">
        Your imagination knows nobounds. Let's make something amazing together!
      </h1>

      {/* 🛠️ MODIFIED VIDEO CONTAINER AND VIDEO ELEMENT 🛠️ */}
      <div className="w-64 h-52  mt-6 md:w-1/4 md:h-auto">
        {/* Video element is perfect and responsive */}
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroComponent;
