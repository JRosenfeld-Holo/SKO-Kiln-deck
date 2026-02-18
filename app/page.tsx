"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Slide1Title from "@/components/Slide1Title";
import Slide2Bottleneck from "@/components/Slide2Bottleneck";
import Slide3Solution from "@/components/Slide3Solution";
import Slide4Metrics from "@/components/Slide4Metrics";
import Slide5Architecture from "@/components/Slide5Architecture";
import Slide6Roadmap from "@/components/Slide6Roadmap";
import Slide8Done from "@/components/Slide8Done";
import PlaybookActivationStrike from "@/components/PlaybookActivationStrike";
import PlaybookGhostProtocol from "@/components/PlaybookGhostProtocol";
import PlaybookScaleUp from "@/components/PlaybookScaleUp";

const slides = [
  { id: 1, label: "Title", component: Slide1Title },
  { id: 2, label: "Bottleneck", component: Slide2Bottleneck },
  { id: 3, label: "Solution", component: Slide3Solution },
  { id: 4, label: "Metrics", component: Slide4Metrics },
  { id: 5, label: "Architecture", component: Slide5Architecture },
  { id: 6, label: "Roadmap", component: Slide6Roadmap },
  { id: 7, label: "Activation Strike", component: PlaybookActivationStrike },
  { id: 8, label: "Ghost Protocol", component: PlaybookGhostProtocol },
  { id: 9, label: "Scale-Up", component: PlaybookScaleUp },
  { id: 10, label: "Done", component: Slide8Done },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const [direction, setDirection] = useState<1 | -1>(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [slideKey, setSlideKey] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index === currentSlide || phase !== "idle") return;
      if (index < 0 || index >= slides.length) return;
      setDirection(index > currentSlide ? 1 : -1);
      setPhase("exit");
      setCurrentSlide(index);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSlideKey(prev => prev + 1);
        setDisplaySlide(index);
        setPhase("enter");
        timeoutRef.current = setTimeout(() => {
          setPhase("idle");
        }, 500);
      }, 280);
    },
    [currentSlide, phase]
  );

  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);
  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const SlideComponent = slides[displaySlide].component;

  const exitTransform = direction === 1 ? "-translate-x-6" : "translate-x-6";

  return (
    <div className="relative w-screen h-screen bg-deep-slate overflow-hidden select-none noise-overlay">
      {/* Ambient grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Slide Content */}
      <div
        key={slideKey}
        className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-[280ms] ease-out
          ${phase === "exit" ? `opacity-0 ${exitTransform} scale-[0.98]` : ""}
          ${phase === "enter" ? "opacity-100 translate-x-0 scale-100" : ""}
          ${phase === "idle" ? "opacity-100 translate-x-0 scale-100" : ""}
        `}
        style={phase === "enter" ? { transitionDuration: "450ms", transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" } : undefined}
      >
        <SlideComponent />
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        {/* Progress bar */}
        <div className="w-full h-[2px] bg-pure-white/5">
          <div
            className="h-full bg-hologram-lime/40 transition-all duration-500 ease-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-8 py-4 bg-deep-slate/80 backdrop-blur-xl">
          {/* Left: slide counter */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <span className="text-hologram-lime font-mono text-sm font-bold">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <div className="w-8 h-px bg-pure-white/20" />
            <span className="text-pure-white/30 font-mono text-sm">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Center: dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`cursor-pointer transition-all duration-300 rounded-full ${i === currentSlide
                    ? "w-8 h-2 bg-hologram-lime shadow-[0_0_12px_rgba(191,253,17,0.6)]"
                    : i < currentSlide
                      ? "w-2 h-2 bg-hologram-lime/30 hover:bg-hologram-lime/50"
                      : "w-2 h-2 bg-pure-white/15 hover:bg-pure-white/30"
                  }`}
                aria-label={`Go to slide ${i + 1}: ${s.label}`}
              />
            ))}
          </div>

          {/* Right: arrows + label */}
          <div className="flex items-center gap-3 min-w-[120px] justify-end">
            <span className="text-pure-white/30 text-xs tracking-wider uppercase hidden sm:block">
              {slides[currentSlide].label}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={prev}
                disabled={currentSlide === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-pure-white/10 text-pure-white/40 hover:text-hologram-lime hover:border-hologram-lime/30 hover:bg-hologram-lime/5 disabled:opacity-15 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                aria-label="Previous slide"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={next}
                disabled={currentSlide === slides.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-pure-white/10 text-pure-white/40 hover:text-hologram-lime hover:border-hologram-lime/30 hover:bg-hologram-lime/5 disabled:opacity-15 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                aria-label="Next slide"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
