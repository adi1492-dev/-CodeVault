'use client';

import React from 'react';
import { ArrowRight, Code2, Cpu, GraduationCap, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap size={16} />
            <span>v1.0 is now live for Campus LAN</span>
          </div>
          
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-none">
            CODE<span className="text-blue-500">VAULT</span>
          </h1>
          
          <p className="text-xl lg:text-3xl text-white/50 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            The next-generation C auto-grading platform powered by a custom-built Go micro-compiler. 
            <span className="text-white"> Instant feedback, zero Docker overhead.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/problems" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              START CODING
              <ArrowRight size={24} />
            </Link>
            <Link href="/teacher" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 font-black text-xl rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              TEACHER PORTAL
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu className="text-blue-400" />}
            title="Custom Compiler"
            description="Our own Go-based Lexer, Parser, and Evaluator. No GCC dependencies, millisecond execution."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-green-400" />}
            title="Secure Sandboxing"
            description="Student code runs in a protected memory-managed environment with built-in resource limits."
          />
          <FeatureCard 
            icon={<Code2 className="text-purple-400" />}
            title="X-Ray Mode"
            description="Visualize the Token Stream and AST live. Perfect for students learning how compilers work."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="LAN Optimized"
            description="Zero external APIs. Designed specifically for offline campus networks and lab environments."
          />
          <FeatureCard 
            icon={<GraduationCap className="text-pink-400" />}
            title="Auto-Grading"
            description="Instant feedback with detailed test case analysis and scoring for every submission."
          />
          <FeatureCard 
            icon={<ArrowRight className="text-white" />}
            title="And More..."
            description="Leaderboards, teacher analytics, and beginner-friendly error messages tailored for first-years."
          />
        </div>
      </section>
    </main>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-blue-500/30 transition-all group">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement, { size: 32 })}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-lg text-white/40 leading-relaxed">{description}</p>
  </div>
);
