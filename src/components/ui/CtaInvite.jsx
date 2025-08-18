import React from "react";
import avatar1 from "@/assets/avatars/avatar-1.png";
import avatar2 from "@/assets/avatars/avatar-2.png";
import avatar3 from "@/assets/avatars/avatar-3.png";

export default function CtaInvite({
  title = "Lets get started implement on your ideas 💡",
  subtitle = "Let's Stay home, Stay safe and save lives. Connect us digitally, we are all ears for you.",
  ctaText = "Let’s Connect",
  ctaHref = "/contact",
}) {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-3xl bg-[#0B1A27] text-white shadow-xl ring-1 ring-black/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Left: headline + copy */}
          <div className="md:pr-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-5 text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Right: CTA stack */}
          <div className="flex flex-col justify-center">
            {/* On mobile show avatars block first, on desktop keep it below button */}
            <div className="order-1 md:order-2 mt-6 md:mt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <img
                    src={avatar1}
                    alt="Team member 1"
                    className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    loading="lazy"
                  />
                  <img
                    src={avatar2}
                    alt="Team member 2"
                    className="h-10 w-10 -ml-3 rounded-full ring-2 ring-white object-cover"
                    loading="lazy"
                  />
                  <img
                    src={avatar3}
                    alt="Team member 3"
                    className="h-10 w-10 -ml-3 rounded-full ring-2 ring-white object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-slate-300">
                  Join with our team to get your product ideas done
                </p>
              </div>
            </div>

            <div className="order-2 md:order-1 mt-6 md:mt-0 md:self-start">
              <a
                href={ctaHref}
                className="inline-flex w-full md:w-auto items-center justify-center rounded-full bg-[#09B8DC] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#08A0C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09B8DC] focus:ring-offset-[#0B1A27]"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
