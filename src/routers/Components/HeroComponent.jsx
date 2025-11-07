import heroVideo from "../../assets/Videos/chroma-keyed-video.webm";

const HeroComponent = () => {
  return (
    <section className="w-full h-[100dvh] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4 ">
      
      {/* Text content */}
      <div className="max-w-4xl">
        <p className="font-oswald font-semibold leading-tight tracking-[0.78px] text-[#1840A7] text-45 capitalize ">
          Don’t just dream <span className="font-sans"> — </span>build it
        </p>

        <h1 className="[font-weight:600] text-[#0A1524] max-w-3xl sm:max-w-4xl text-35 font-poppins capitalize">
          Limitless imagination. Endless possibilities. Let’s build together!
        </h1> 
      </div>

      {/* Video container */}
      <div className="w-full max-w-[100%] md:max-w-[60%] lg:max-w-[40%]">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default HeroComponent;
