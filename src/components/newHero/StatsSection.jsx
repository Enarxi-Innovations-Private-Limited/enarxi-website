import React from "react";

const StatsSection = () => {
  const stats = [
    { label: "used by", number: "14.4", suffix: "k", desc: "designers and developers" },
    { label: "used by", number: "4.8", suffix: "k", desc: "designers on Figma Community" },
    { label: "over", number: "1121", suffix: "", desc: "clones and forks of the template on Github" },
    { label: "already", number: "8.5", suffix: "k", desc: "installations with shadcn/ui CLI" },
  ];

  return (
    <>
      <section className="relative bg-[#060607] text-white py-20 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold  leading-tight mb-4">
            We Do It Differently at <br /> Enarxi
            </h2>
            <p className="text-gray-400 max-w-md">
            We empower customers with knowledge, deliver value through innovation, and craft reliable technology solutions for lasting success.
            </p>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="card relative overflow-hidden rounded-2xl p-6">
                {/* soft blue glow behind the number */}
                <span className="card-glow" aria-hidden />

                <p className="text-gray-400 text-sm mb-1">{s.label}</p>

                <div className="relative z-10">
                  <h3 className="stat-number text-3xl md:text-4xl font-extrabold leading-none">
                    {s.number}
                    {s.suffix && <span className="ml-1 align-top text-lg font-semibold">{s.suffix}</span>}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoped styles updated to the new BLUE color scheme */}
        <style>{`
          /* --- COLOR VARIABLES UPDATED TO BLUE --- */
          :root{ 
            --card-bg: rgba(255,255,255,0.018); 
            --card-border: rgba(255,255,255,0.035); 
            --blue1: #87CEFA; /* Light Sky Blue */
            --blue2: #1E90FF; /* Dodger Blue */
            --glow-color: rgba(10,99,240,0.5); /* The blue from your gradient */
          }

          .card{
            background: linear-gradient(180deg, var(--card-bg), rgba(0,0,0,0.02));
            border: 1px solid var(--card-border);
            box-shadow: 0 12px 30px rgba(0,0,0,0.6);
          }

          .card::before{
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            background: linear-gradient(180deg, rgba(255,255,255,0.008), transparent);
            mix-blend-mode: overlay;
          }

          .card::after{
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: repeating-linear-gradient(180deg, rgba(255,255,255,0.006) 0 1px, transparent 1px 6px);
            opacity: 0.06;
            border-radius: inherit;
          }

          /* --- CARD GLOW UPDATED WITH YOUR GRADIENT --- */
          .card-glow{
            position: absolute;
            right: -8%;
            top: -28%;
            width: 350px;
            height: 400px;
            background: radial-gradient(ellipse 40% 100% at 50% -20%, var(--glow-color), rgba(255,255,255,0));
            filter: blur(36px);
            transform: translateZ(0);
            pointer-events: none;
            opacity: 0.95;
          }

          /* --- STAT NUMBER UPDATED TO BLUE GRADIENT AND SHADOW --- */
          .stat-number{
            background: linear-gradient(180deg, var(--blue1), var(--blue2));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 10px 34px rgba(10,99,240,0.35), 0 2px 6px rgba(0,0,0,0.6);
          }

          .stat-number + span{ font-weight: 700; }

          @media (min-width: 768px){
            .stat-number{ font-size: 38px; }
          }
        `}</style>
      </section>
    </>
  );
};

export default StatsSection;


// import React from 'react';

// const statsData = [
//   {
//     label: 'used by',
//     value: '14.4k',
//     description: 'designers and developers',
//   },
//   {
//     label: 'used by',
//     value: '4.8k',
//     description: 'designers on Figma Community',
//   },
//   {
//     label: 'over',
//     value: '1121',
//     description: 'clones and forks of the template on Github',
//   },
//   {
//     label: 'already',
//     value: '8.5k',
//     description: 'installations with shadcn/ui CLI',
//   },
// ];

// // Reusable StatCard component
// const StatCard = ({ label, value, description }) => (
//   <div className="bg-[#1C1C1C] p-6 rounded-xl text-center flex flex-col justify-center">
//     <p className="text-sm text-gray-400">{label}</p>
//     {/* Applied custom CSS class for super glowing text effect */}
//     <p className="text-5xl font-bold my-2 super-glowing-gold-text">
//       {value}
//     </p>
//     <p className="text-sm text-gray-400">{description}</p>
//   </div>
// );

// const ProvenSolution = () => {
//   return (
//     // Background adjusted for a darker, richer canvas to make gold pop
//     <section className="relative text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden
//                         bg-gradient-to-br from-gray-950 via-black to-black">
//       {/* Enhanced background glow, stronger and more golden */}
//       <div className="absolute inset-0 z-0"
//            style={{
//              background: 'radial-gradient(circle at 5% 5%, rgba(255,230,150,0.15) 0%, transparent 35%), ' +
//                          'radial-gradient(circle at 95% 95%, rgba(255,230,150,0.12) 0%, transparent 35%)',
//              filter: 'brightness(0.7) saturate(1.5)' // Make background glows brighter and more colorful
//            }}></div>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-center relative z-10">
        
//         {/* Left Column: Text Content */}
//         <div className="md:col-span-2">
//           {/* Main title also gets the super glowing effect */}
//           <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight super-glowing-gold-text">
//             A proven solution for good design
//           </h2>
//           <p className="mt-4 text-gray-300"> {/* Slightly lighter text for better contrast on darker background */}
//             Thousands of designers and developers have already used Launch UI to create beautiful and functional websites and products.
//           </p>
//         </div>
        
//         {/* Right Column: Stats Grid */}
//         <div className="md:col-span-3 grid grid-cols-2 gap-6">
//           {statsData.map((stat, index) => (
//             <StatCard
//               key={index}
//               label={stat.label}
//               value={stat.value}
//               description={stat.description}
//             />
//           ))}
//         </div>

//       </div>

//       {/* Embedded CSS for the SUPER glowing gold text effect */}
//       <style jsx>{`
//         .super-glowing-gold-text {
//           /* More vibrant gold gradient */
// background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           color: transparent; /* Fallback */
          
//           /* Much more intense and spread out text shadows for max shine */
//           text-shadow:
//             0 0 8px rgba(255,240,150,0.9),   /* Brightest inner core */
//             0 0 20px rgba(255,220,100,0.8),  /* Stronger mid glow */
//             0 0 40px rgba(255,200,50,0.7),   /* Wider outer glow */
//             0 0 60px rgba(255,180,0,0.6),    /* Even wider spread */
//             0 0 80px rgba(255,160,0,0.1);    /* Max diffusion */
          
//           /* Optional: Add a subtle filter for a slight halo/pop, adjust as needed */
//           filter: drop-shadow(0 0 5px rgba(255,215,0,0.8)) brightness(1.0);
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProvenSolution;