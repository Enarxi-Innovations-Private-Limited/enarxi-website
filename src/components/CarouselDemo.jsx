"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const CarouselDemo = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const carouselRef = React.useRef(null);

  useEffect(() => {
    // Create query to fetch team members ordered by the order field
    // Filter visibility on client side to avoid composite index requirement
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));

    // Set up real-time listener
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
              image:
                data.images && data.images.length > 0
                  ? data.images[0].url
                  : null,
              visibility: data.visibility ?? true,
            };
          })
          // Filter for visible members only
          .filter((member) => member.visibility === true);

        setTeamMembers(members);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching team members:", error);
        setError("Failed to load team members");
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Auto-scroll hint animation on mobile when carousel comes into view
  useEffect(() => {
    if (!api || hasAnimated || teamMembers.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Check if mobile device
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              // Wait a bit after the section is visible
              setTimeout(() => {
                api.scrollNext();
                // Scroll back to original position
                setTimeout(() => {
                  api.scrollPrev();
                  setHasAnimated(true);
                }, 600);
              }, 300);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, [api, hasAnimated, teamMembers.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No team members to display
        </p>
      </div>
    );
  }

return (
  <div ref={carouselRef}>
    <Carousel
      setApi={setApi}
      opts={{ align: "center" }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {teamMembers.map((member) => (
          <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <Card
                className="text-center border-2 shadow-md rounded-xl transition-transform hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(318deg,rgba(255,255,255,1) 39%, rgba(181,212,232,0.9) 100%)",
                }}
              >
                <CardContent className="flex flex-col items-center p-4 pt-6 h-72">
                  {member.image ? (
                    <motion.div
                      className="relative mb-0 mx-auto w-fit group"

                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="aspect-[4/5] relative bottom-2 w-24 md:w-34 rounded-xl object-cover border-3 border-background transition-all ease-out duration-300 group-hover:border-primary/50 shadow-sm"
                        whileHover={{ scale: 1.1 }}
                      />
                    </motion.div>
                  ) : (
                    <div className="aspect-[4/5] relative bottom-2 w-24 md:w-28 rounded-xl bg-gray-200 border border-gray-300 shadow-sm flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}

                  <div className="mt-3 relative top-3 -mb-2 text-center">
                    <h3 className="text-2xl text-oswald-semibold text-primary">
                      {member.name}
                    </h3>
                    <p className="text-md text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows Below */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <CarouselPrevious className="relative" />
        <CarouselNext className="relative" />
      </div>
    </Carousel>
  </div>
);
};

export default CarouselDemo;
