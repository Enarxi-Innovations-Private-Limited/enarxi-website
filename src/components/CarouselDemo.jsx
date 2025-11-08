// "use client";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";

// import React, { useState, useEffect } from "react";
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Loader2 } from "lucide-react";

// const tileLayout = [
//   "lg:col-span-2 lg:row-span-2",
//   "lg:col-span-1 lg:row-span-1",
//   "lg:col-span-1 lg:row-span-2",
//   "lg:col-span-2 lg:row-span-1",
//   "lg:col-span-1 lg:row-span-1",
//   "lg:col-span-2 lg:row-span-1",
// ];

// const accentBorders = [
//   "from-white/60 via-white/20 to-white/0",
//   "from-slate-200/70 via-slate-200/10 to-transparent",
//   "from-stone-200/60 via-white/10 to-transparent",
//   "from-neutral-300/60 via-white/10 to-transparent",
// ];

// const CarouselDemo = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Create query to fetch team members ordered by the order field
//     // Filter visibility on client side to avoid composite index requirement
//     const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));

//     // Set up real-time listener
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const members = snapshot.docs
//           .map((doc) => {
//             const data = doc.data();
//             return {
//               id: doc.id,
//               name: data.name || "Team Member",
//               role: data.role || "Role",
//               image:
//                 data.images && data.images.length > 0
//                   ? data.images[0].url
//                   : null,
//               visibility: data.visibility ?? true,
//             };
//           })
//           // Filter for visible members only
//           .filter((member) => member.visibility === true);

//         setTeamMembers(members);
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching team members:", error);
//         setError("Failed to load team members");
//         setLoading(false);
//       }
//     );

//     // Cleanup listener on unmount
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500 text-lg">{error}</p>
//       </div>
//     );
//   }

//   if (teamMembers.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground text-lg">
//           No team members to display
//         </p>
//       </div>
//     );
//   }
//   return (
//     <section className="relative w-full">
//       <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0b0d10]" />
//       <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(38,45,56,0.65),transparent_55%)]" />

//       <div className="relative mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-10 py-6 sm:py-10">
//         <div className="mx-auto mb-12 max-w-3xl text-center text-white">
//           <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
//             Our Collective
//           </p>
//           <h3 className="mt-4 text-3xl font-oswald font-semibold sm:text-4xl">
//             Visionaries, designers, and engineers crafting meaningful product experiences
//           </h3>
//           <p className="mt-4 text-base text-white/70">
//             Hover over each profile to bring their full colour and learn who is shaping the future at Enarxi.
//           </p>
//         </div>

//         <div className="grid auto-rows-[minmax(220px,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {teamMembers.map((member, index) => {
//             const tileClass = tileLayout[index % tileLayout.length];
//             const accent = accentBorders[index % accentBorders.length];

//             return (
//               <motion.article
//                 key={member.id}
//                 initial={{ opacity: 0, y: 30, scale: 0.96 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
//                 className={`group relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/0 p-[1px] ${tileClass}`}
//               >
//                 <div className={`absolute inset-0 -z-10 bg-linear-to-br ${accent}`} />
//                 <Card className="relative h-full overflow-hidden rounded-[24px] border border-white/5 bg-[#0e1116] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
//                   <CardContent className="relative h-full p-0">
//                     <div className="relative flex h-full w-full items-end">
//                       {member.image ? (
//                         <motion.img
//                           src={member.image}
//                           alt={member.name}
//                           className="h-full w-full object-cover transition duration-700 ease-out filter grayscale group-hover:scale-105 group-hover:filter-none"
//                           initial={false}
//                           whileHover={{ scale: 1.05 }}
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
//                           No Image
//                         </div>
//                       )}

//                       <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition duration-500 group-hover:from-black/50" />

//                       <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
//                         <div className="h-[1px] w-12 bg-white/40 transition-all duration-500 group-hover:w-20" />
//                         <div className="flex flex-col gap-1">
//                           <h4 className="text-lg font-semibold text-white font-oswald">
//                             {member.name}
//                           </h4>
//                           <p className="text-xs uppercase tracking-[0.35em] text-white/60">
//                             {member.role}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CarouselDemo;

"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const accentBorders = [
  "from-white/50 via-white/10 to-transparent",
  "from-slate-200/50 via-slate-100/10 to-transparent",
  "from-stone-200/50 via-white/10 to-transparent",
  "from-neutral-300/50 via-white/10 to-transparent",
];

const TeamBentoGrid = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "Team Member",
              role: data.role || "Role",
              image: data.images?.[0]?.url || null,
              visibility: data.visibility ?? true,
            };
          })
          .filter((m) => m.visibility);
        setTeamMembers(members);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (teamMembers.length === 0)
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          No team members to display
        </p>
      </div>
    );

  return (
    <section className="relative w-full overflow-hidden py-10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        {/* CLEAN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const accent = accentBorders[index % accentBorders.length];

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
                // 🧠 Here’s the fix:
                className={`group relative overflow-hidden rounded-[28px] border border-white/5 bg-[#0f1115] transition-all duration-500 aspect-[4/5] shadow-[0_15px_40px_-25px_rgba(15,17,21,0.7)] hover:border-white/20`}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${accent} opacity-10`} />


                {member.image ? (
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-sm uppercase tracking-[0.25em] text-white/50">
                    No Image
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent transition-all duration-500 group-hover:from-black/55" />

                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-[18px] bg-black/0 px-1">
                  <div className="h-[1px] w-12 bg-white/40 transition-all duration-500 group-hover:w-20" />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base sm:text-lg font-semibold text-white font-oswald">
                      {member.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/60">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamBentoGrid;
