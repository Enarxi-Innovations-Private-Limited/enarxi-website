import { useEffect, useRef, useState } from "react";

import idea from "../../assets/images/idea.svg";
import people from "../../assets/images/people.svg";
import packageHands from "../../assets/images/package.svg"
import computer from "../../assets/images/computer.svg";


function Counter({ end, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const [startCount, setStartCount] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 } // start when 30% visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startCount) return;

    let start = 0;
    const step = end / (duration / 9); // ~60fps

    function update() {
      start += step;
      if (start < end) {
        setCount(Math.floor(start));
        requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(update);
  }, [startCount, end, duration]);

  return (
    <span ref={ref}>
      {count}
    </span>
  );
}

export default function OurStats() {
  const stats = [
    { icon: idea, value: 500, label: "Projects" },
    { icon: people, value: 30, label: "Events & Workshops" },
    { icon: packageHands, value: 2000, label: "Participants" },
    { icon: computer, value: 500, label: "Projects" },
  ];

  return (
    <section className="w-full bg-[#0B1A27] py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <img
              src={s.icon}
              alt=""
              className="h-12 w-12 mb-2 object-contain"
            />
            <p>
              <span className="text-xl font-semibold">
                <Counter end={s.value} duration={800} />+
              </span>{" "}
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
