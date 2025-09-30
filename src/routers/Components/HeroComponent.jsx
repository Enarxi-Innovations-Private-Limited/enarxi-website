import heroVideo from "../../assets/Videos/heroVideo.mp4"

const HeroComponent = () => {
    return (
             <section className="w-full h-[calc(100vh-64px)] bg-gradient-to-b from-[#DEF4FF] to-white flex flex-col items-center justify-center text-center px-4">
                   <p className="font-noto font-medium leading-[100%] tracking-[0.78px] text-[#1840A7] text-center capitalize text-xl md:text-3xl lg:4xl mb-4 mt-6">
                     Don't Just Dream It, Build It
                   </p>
           
                   <h1 className="font-semibold text-[#0A1524] max-w-4xl text-xl md:text-[34px] font-poppins leading-snug capitalize mb-6">
                     Your imagination knows no bounds. Let's make something amazing
                     together!
                   </h1>
           
                   {/* <button className="bg-[#0A1524] text-white px-8 py-3 rounded-full shadow transition flex items-center gap-2 cursor-pointer mb-12">
                     Explore →
                   </button> */}
           
                   {/* img */}
                   <div className="w-48 h-44 mt-6 md:w-1/4 md:h-auto object-cover">
                     <video src={heroVideo} autoPlay loop muted  />
                   </div>
                 </section>
    )
}

export default HeroComponent;