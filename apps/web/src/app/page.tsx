"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Botanical SVG decoration component
function BotanicalLeaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 0C50 0 20 60 20 120C20 160 35 200 50 200C65 200 80 160 80 120C80 60 50 0 50 0Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M50 20V180M50 40C35 50 30 70 50 80M50 80C65 70 70 50 50 40M50 100C35 110 30 130 50 140M50 140C65 130 70 110 50 100"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
    </svg>
  );
}

// Feature card component
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-up group relative opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Glow effect on hover */}
      <div className="from-laurel-glow/20 to-laurel-sage/20 absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />

      <div className="bg-laurel-moss/40 border-laurel-sage/10 group-hover:border-laurel-sage/30 group-hover:bg-laurel-moss/60 relative h-full rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500">
        {/* Icon */}
        <div className="from-laurel-glow/20 to-laurel-sage/10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-display text-laurel-cream mb-3 text-2xl">{title}</h3>
        <p className="text-laurel-cream/60 leading-relaxed">{description}</p>

        {/* Decorative line */}
        <div className="via-laurel-sage/30 absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-laurel-midnight relative min-h-screen overflow-hidden">
      {/* Grain texture overlay */}
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />

      {/* Ambient glow effects */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="bg-laurel-glow/5 animate-glow absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="bg-laurel-sage/5 animate-glow absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full blur-[100px]"
          style={{
            animationDelay: "1.5s",
            transform: `translateY(${-scrollY * 0.05}px)`,
          }}
        />
      </div>

      {/* Botanical decorations */}
      <BotanicalLeaf className="text-laurel-sage fixed left-0 top-1/4 h-48 w-24 -translate-x-1/2 opacity-20" />
      <BotanicalLeaf className="text-laurel-glow fixed right-0 top-1/3 h-64 w-32 translate-x-1/2 rotate-12 opacity-10" />
      <BotanicalLeaf className="text-laurel-sage fixed bottom-20 left-20 h-40 w-20 rotate-45 opacity-15" />

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-40 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <div
            className="animate-fade-in flex items-center opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <Image
              priority
              alt="Laurel"
              className="h-10 w-auto"
              height={40}
              src="/laurel-logo-white.svg"
              width={144}
            />
          </div>

          {/* Nav links */}
          <div
            className="animate-fade-in flex items-center gap-6 opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            <Link
              className="text-laurel-cream/70 hover:text-laurel-cream text-sm tracking-wide transition-colors duration-300"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="group relative overflow-hidden rounded-full px-5 py-2.5"
              href="/signup"
            >
              <div className="from-laurel-glow to-laurel-sage absolute inset-0 bg-gradient-to-r opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="text-laurel-midnight relative text-sm font-medium tracking-wide">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}
          <div
            className="bg-laurel-moss/50 border-laurel-sage/20 animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <div className="bg-laurel-glow animate-glow h-2 w-2 rounded-full" />
            <span className="text-laurel-sage text-sm tracking-wide">
              Powered by AI • Rooted in Science
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-laurel-cream animate-fade-up mb-8 text-5xl leading-[1.1] opacity-0 md:text-7xl lg:text-8xl"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            Cultivate habits
            <br />
            <span className="from-laurel-glow via-laurel-sage to-laurel-glow animate-shimmer bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent">
              that flourish
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-laurel-cream/60 animate-fade-up mx-auto mb-12 max-w-2xl text-xl leading-relaxed opacity-0 md:text-2xl"
            style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
          >
            Your personal AI coach guides you through the science of behavior change. Build lasting
            habits using Atomic Habits methodology and evidence-based learning.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
            style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          >
            <Link className="group relative overflow-hidden rounded-full px-8 py-4" href="/signup">
              <div className="from-laurel-glow to-laurel-sage absolute inset-0 bg-gradient-to-r" />
              <div className="from-laurel-sage to-laurel-glow absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="text-laurel-midnight relative flex items-center gap-2 font-semibold tracking-wide">
                Start Your Journey
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
            </Link>

            <Link
              className="border-laurel-sage/30 hover:border-laurel-sage/60 group rounded-full border px-8 py-4 transition-colors duration-300"
              href="/login"
            >
              <span className="text-laurel-cream/80 group-hover:text-laurel-cream font-medium tracking-wide">
                I have an account
              </span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            className="animate-fade-in absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
            style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}
          >
            <span className="text-laurel-cream/40 text-xs uppercase tracking-widest">Discover</span>
            <div className="from-laurel-sage/50 animate-grow-line h-12 w-px bg-gradient-to-b to-transparent" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-20 text-center">
            <h2
              className="font-display text-laurel-cream animate-fade-up mb-6 text-4xl opacity-0 md:text-5xl"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              Four pillars of
              <br />
              <span className="text-laurel-sage">transformation</span>
            </h2>
            <p
              className="text-laurel-cream/50 animate-fade-up mx-auto max-w-xl opacity-0"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              A holistic approach combining AI intelligence, behavioral science, learning
              optimization, and community support.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <FeatureCard
              delay={300}
              description="Your personal AI coach understands your goals, challenges, and patterns. Get personalized guidance that adapts to your progress and helps you overcome obstacles."
              icon={
                <svg
                  className="text-laurel-glow h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              title="AI Coaching"
            />

            <FeatureCard
              delay={400}
              description="Built on James Clear's proven methodology. Make tiny changes that compound into remarkable results. Focus on systems, not goals, and become 1% better every day."
              icon={
                <svg
                  className="text-laurel-glow h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              title="Atomic Habits"
            />

            <FeatureCard
              delay={500}
              description="Learn and retain knowledge with scientifically-optimized flashcards. Our algorithm adapts to your memory patterns, ensuring you never forget what matters."
              icon={
                <svg
                  className="text-laurel-glow h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              title="Spaced Repetition"
            />

            <FeatureCard
              delay={600}
              description="Join small groups of like-minded individuals on similar journeys. Share progress, celebrate wins, and stay motivated through the power of community."
              icon={
                <svg
                  className="text-laurel-glow h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              title="Accountability Pods"
            />
          </div>
        </div>
      </section>

      {/* Social proof / Stats section */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="from-laurel-moss/60 to-laurel-fern/40 border-laurel-sage/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-12 md:p-16">
            {/* Background decoration */}
            <div className="bg-laurel-glow/5 absolute right-0 top-0 h-64 w-64 rounded-full blur-[80px]" />
            <Image
              alt=""
              className="absolute -bottom-10 -right-10 h-48 w-auto opacity-10"
              height={192}
              src="/laurel-logo-white.svg"
              width={691}
            />

            <div className="relative text-center">
              <h2 className="font-display text-laurel-cream mb-4 text-3xl md:text-4xl">
                Victory awaits those who persist
              </h2>
              <p className="text-laurel-cream/60 mx-auto mb-12 max-w-xl">
                The laurel wreath has crowned champions for millennia. Now it&apos;s your turn to
                earn yours.
              </p>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="font-display text-laurel-glow mb-2 text-4xl md:text-5xl">21</div>
                  <div className="text-laurel-cream/50 text-sm">
                    Days to form
                    <br />a habit
                  </div>
                </div>
                <div>
                  <div className="font-display text-laurel-glow mb-2 text-4xl md:text-5xl">1%</div>
                  <div className="text-laurel-cream/50 text-sm">
                    Daily improvement
                    <br />
                    compounds
                  </div>
                </div>
                <div>
                  <div className="font-display text-laurel-glow mb-2 text-4xl md:text-5xl">37x</div>
                  <div className="text-laurel-cream/50 text-sm">
                    Better in
                    <br />
                    one year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Image
            alt="Laurel"
            className="mx-auto mb-8 h-20 w-auto opacity-40"
            height={80}
            src="/laurel-logo-white.svg"
            width={288}
          />

          <h2 className="font-display text-laurel-cream mb-6 text-4xl md:text-5xl">
            Begin your transformation
          </h2>
          <p className="text-laurel-cream/60 mb-12 text-xl">
            Every great achievement starts with a single step.
            <br />
            Take yours today.
          </p>

          <Link
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-10 py-5"
            href="/signup"
          >
            <div className="from-laurel-glow via-laurel-sage to-laurel-glow animate-shimmer absolute inset-0 bg-gradient-to-r bg-[length:200%_auto]" />
            <span className="text-laurel-midnight relative text-lg font-semibold tracking-wide">
              Create Free Account
            </span>
            <svg
              className="text-laurel-midnight relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 8l4 4m0 0l-4 4m4-4H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-laurel-sage/10 relative border-t px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center">
            <Image
              alt="Laurel"
              className="h-8 w-auto opacity-60"
              height={32}
              src="/laurel-logo-white.svg"
              width={115}
            />
          </div>

          <div className="text-laurel-cream/40 flex items-center gap-8 text-sm">
            <Link className="hover:text-laurel-cream/70 transition-colors" href="/login">
              Log in
            </Link>
            <Link className="hover:text-laurel-cream/70 transition-colors" href="/signup">
              Sign up
            </Link>
          </div>

          <p className="text-laurel-cream/30 text-sm">
            © {new Date().getFullYear()} Laurel. Cultivate your potential.
          </p>
        </div>
      </footer>
    </main>
  );
}
