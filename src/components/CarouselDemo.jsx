"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const CarouselDemo = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create query to fetch team members ordered by the order field
    // Filter visibility on client side to avoid composite index requirement
    const q = query(
      collection(db, "teamMembers"),
      orderBy("order", "asc")
    );

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
              image: data.images && data.images.length > 0 ? data.images[0].url : null,
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
        <p className="text-muted-foreground text-lg">No team members to display</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "center",
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {teamMembers.map((member, index) => (
          <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <Card
                className="text-center shadow-md rounded-xl transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to bottom right, #eef8fe, #ffffff)",
                }}
              >
                <CardContent className="flex flex-col items-center p-4 pt-6 h-72">
                  {/* Image */}
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="aspect-[4/5] relative bottom-2 w-24 md:w-28 rounded-xl object-cover border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="aspect-[4/5] relative bottom-2 w-24 md:w-28 rounded-xl bg-gray-200 border border-gray-300 shadow-sm flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}

                  {/* Text Section */}
                  <div className="mt-3 relative top-10 -mb-2 text-center">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselDemo;
