"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Bob Smith",
    role: "Backend Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Clara Lee",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    name: "Emma Chen",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/77.jpg",
  },
  {
    name: "Frank Wilson",
    role: "QA Analyst",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
  {
    name: "Grace Park",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Henry Adams",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const CarouselDemo = () => {
  return (
    <Carousel
      opts={{
        align: "center",
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {teamMembers.map((member, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[4.5/5] relative bottom-2 w-24 md:w-28 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />

                  {/* Text Section */}
                  <div className="mt-3 relative top-10 -mb-2 text-center">
                    {" "}
                    {/* 👈 Space above, move up a bit with -mb */}
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
