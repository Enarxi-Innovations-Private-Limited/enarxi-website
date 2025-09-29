import heroVideo from "../../assets/Videos/heroVideo.mp4";

const HeroComponent = () => {
  return (
    <section className="w-full h-[calc(100vh-64px)] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
      <p class="font-noto font-medium leading-[100%] tracking-[0.78px] text-[#1840A7] text-center capitalize text-2xl sm:text-3xl md:text-3xl lg:4xl mb-4 mt-6">
        Don't Just Dream It, Build It
      </p>

      <h1 className="font-semibold text-[#0A1524] max-w-3xl  text-lg sm:text-xl md:text-[34px] font-poppins leading-snug capitalize mb-6">
        Your imagination knows no bounds. Let's make something amazing together!
      </h1>

      {/* img */}
      <div className="w-48 h-44 mt-6 md:w-1/4 md:h-auto object-cover">
        <video src={heroVideo} autoPlay loop muted />
      </div>
    </section>
  );
};

export default HeroComponent;
