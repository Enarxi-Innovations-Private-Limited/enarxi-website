import heroVideo from "../../assets/Videos/chroma-keyed-video.webm";

const HeroComponent = () => {
  return (
    <section className="w-full h-[calc(90vh-64px)] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
      <p className="font-oswald text-weight-600 leading-[100%] tracking-[0.78px] text-[#1840A7] text-center capitalize text-2xl sm:text-3xl md:text-3xl lg:4xl mb-4 mt-15">
        Don’t just dream — build it
      </p>

      <h1 className="[font-weight:600] text-[#0A1524] max-w-3xl text-lg sm:text-xl md:text-[34px] font-poppins capitalize mb-6">
        Limitless imagination. Endless possibilities. Let’s build together!
      </h1>

      {/* 🛠️ MODIFIED VIDEO CONTAINER AND VIDEO ELEMENT 🛠️ */}
      <div className="mt-6 w-full md:w-2/5 lg:w-1/3 md:h-auto">
         <video
    src={heroVideo}
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  />
    </div>   
 </section>
  );
};

export default HeroComponent;
