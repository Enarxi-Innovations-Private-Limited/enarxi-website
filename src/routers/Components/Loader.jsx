"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "../styles/loader.css";

export default function Loader({ loading, onComplete }) {
  useEffect(() => {
    if (!loading) return; // Don't run GSAP if loader is hidden

    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const tl = gsap.timeline({
      delay: 0.1, // Reduced from 0.3 for faster start
      defaults: { ease: "hop" },
      onComplete: onComplete,
    });

    const counts = document.querySelectorAll(".count");

    counts.forEach((count, index) => {
      const digits = count.querySelectorAll(".digit h1");
      tl.to(digits, { y: "0%", duration: 0.8, stagger: 0.05 }, index * 0.8); // Reduced duration and stagger
      if (index < counts.length) {
        tl.to(digits, { y: "-100%", duration: 0.8, stagger: 0.05 }, index * 0.8 + 0.8);
      }
    });

    tl.to(".spinner", { opacity: 0, duration: 0.2 }, "-=0.2"); // Adjusted timing
    tl.to(".word h1", { y: "0%", duration: 1 }, "<");
    tl.to(".divider", {
      scaleY: "100%",
      duration: 0.8,
      onComplete: () => gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.2 }),
    });

    tl.to("#word-1 h1", { y: "100%", duration: 0.8, delay: 0.2 });
    tl.to("#word-2 h1", { y: "-100%", duration: 0.8 }, "<");
    tl.to(".block", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 0.8,
      stagger: 0.08,
      delay: 0.5, // Reduced delay
      onStart: () => gsap.to(".hero-img", { scale: 1, duration: 1.5, ease: "hop" }),
    });

    tl.to([".nav", ".line h1", ".line p"], { y: "0%", duration: 0.8, stagger: 0.15 }, "<");
    tl.to([".cta", ".cta-icon"], { scale: 1, duration: 1.2, stagger: 0.5, delay: 0.5 }, "<");
    tl.to(".cta-label p", { y: "0%", duration: 1.2, delay: 0.4 }, "<");
  }, [loading]);

  if (!loading) return null; // Hide loader after done

  return (
    <div className="loader fixed top-0 left-0 w-full h-screen z-50">
      <div className="overlay">
        <div className="block"></div>
        <div className="block"></div>
      </div>

      <div className="intro-logo">
        <div className="word" id="word-1">
          <h1>
            <span>Kind</span>
          </h1>
        </div>
        <div className="word" id="word-2">
          <h1>Root</h1>
        </div>
      </div>

      <div className="divider"></div>

      <div className="spinner-container">
        <div className="spinner"></div>
      </div>

      <div className="counter">
        {[
          [0, 0],
          [2, 7],
          [6, 5],
          [9, 8],
          [9, 9],
        ].map((nums, i) => (
          <div className="count" key={i}>
            {nums.map((n, j) => (
              <div className="digit" key={j}>
                <h1>{n}</h1>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}