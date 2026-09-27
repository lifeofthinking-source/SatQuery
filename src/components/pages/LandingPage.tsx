/**
 * LandingPage.tsx
 *
 * Public landing page for SatQuery AI.
 * Design intent: Indian government digital portal — calm, institutional,
 * information-first. NOT a SaaS marketing page.
 *
 * Structure:
 *   1. Announcement strip
 *   2. Institutional header (own, not SubNav)
 *   3. Hero — two-column, tagline + analysis visual
 *   4. Three-capability strip
 *   5. How it works — one horizontal process
 *   6. Designed for — compact user list
 *   7. Demonstration strip
 *   8. CTA
 *   9. Footer
 */

import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Globe,
  CheckCircle2,
  FileSearch,
  Layers,
  GitMerge,
  MapPin,
  Building2,
  Leaf,
  Droplets,
  Wheat,
  FlaskConical,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ─── Announcement strip ───────────────────────────────────────────────────────

const AnnouncementStrip: React.FC = () => (
  <div className="bg-blue-950 text-blue-100 py-2 px-4 text-center">
    <p className="text-[11px] font-medium tracking-wide flex items-center justify-center gap-2 flex-wrap">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse shrink-0" />
      Smart India Hackathon 2026 · Problem Statement 26167 ·
      <span className="font-semibold text-white">
        Interactive Vision-Language Assistant for Multimodal Remote Sensing
      </span>
    </p>
  </div>
);

// ─── Landing-specific header ──────────────────────────────────────────────────

const LandingHeader: React.FC<{ onLogin: () => void; onDemo: () => void }> = ({ onLogin, onDemo }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
      {/* Left: emblem + title */}
      <div className="flex items-center gap-3">
        {/* Government-style emblem */}
        <div className="w-9 h-9 border-2 border-slate-800 rounded bg-white flex items-center justify-center shrink-0">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-900">
            <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2.5" />
            <path d="M20 5v30M5 20h30M9 9l22 22M9 31L31 9" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
            <circle cx="20" cy="20" r="4" fill="#1e3a8a" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 leading-none">
            Earth Observation Intelligence Platform
          </p>
          <p className="text-base font-bold text-slate-900 tracking-tight leading-tight">
            SATQUERY AI
          </p>
        </div>
      </div>

      {/* Right: nav + login */}
      <nav className="flex items-center gap-1" aria-label="Portal navigation">
        {['Home', 'About', 'Research', 'Help', 'Accessibility'].map(item => (
          <button
            key={item}
            type="button"
            className="hidden sm:block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={onDemo}
          className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-800 border border-blue-200 rounded hover:bg-blue-50 transition-colors ml-1"
        >
          View Demonstration
        </button>

        <button
          type="button"
          onClick={onLogin}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded transition-colors ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
        >
          <Shield className="w-3.5 h-3.5" />
          Government Login
        </button>
      </nav>
    </div>
  </header>
);

// ─── Analysis visual (hero right column) ─────────────────────────────────────

const AnalysisVisual: React.FC = () => (
  <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
    {/* Title bar */}
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-900" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          SatQuery Analysis Console
        </span>
      </div>
      <span className="text-[10px] text-slate-400 font-mono">DEMONSTRATION</span>
    </div>

    {/* Satellite image panel */}
    <div className="relative bg-slate-800 aspect-video overflow-hidden">
      <img
        src="/images/demo-primary.png"
        alt="Demonstration satellite imagery"
        className="w-full h-full object-cover opacity-80"
        loading="lazy"
      />
      {/* Location label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white px-2 py-0.5 rounded text-[10px] font-mono">
        <MapPin className="w-3 h-3" />
        Demo Urban Region · Sentinel-2
      </div>
      {/* Corner badge */}
      <div className="absolute top-2 right-2 bg-amber-500/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider">
        Demo
      </div>
    </div>

    {/* Query input */}
    <div className="px-4 py-3 border-b border-slate-200 bg-white">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        Natural-language query
      </p>
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium">
        <span className="text-blue-700 font-bold text-sm leading-none">"</span>
        Where has new construction occurred?
        <span className="text-blue-700 font-bold text-sm leading-none">"</span>
      </div>
    </div>

    {/* Mini process flow */}
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center gap-1.5 text-[10px]">
        {[
          { label: 'Query', done: true },
          { label: 'Evidence', done: true },
          { label: 'Verification', done: true },
        ].map((step, i, arr) => (
          <React.Fragment key={step.label}>
            <div className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-semibold
              ${step.done ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-500 border-slate-200'}`}>
              {step.done && <CheckCircle2 className="w-3 h-3" />}
              {step.label}
            </div>
            {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Result row */}
    <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
      <div>
        <p className="text-xs font-bold text-emerald-900">Evidence Supported</p>
        <p className="text-[10px] text-emerald-700">New construction detected · Area quantified · SAR confirmed</p>
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, startAnalysisWorkflow } = useApp();

  const handleLogin = () => setCurrentRoute('login');
  const handleDemo  = () => { startAnalysisWorkflow(); };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 antialiased">
      <AnnouncementStrip />
      <LandingHeader onLogin={handleLogin} onDemo={handleDemo} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-6">
              <Globe className="w-3 h-3 text-blue-800" />
              Earth Observation Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-5">
              Ask the Earth.<br />
              <span className="text-blue-900">Get the Evidence.</span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg">
              Natural-language Earth Observation intelligence for evidence-driven analysis.
              Ask questions about satellite imagery. SatQuery determines the required analysis automatically.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                <Shield className="w-4 h-4" />
                Government Login
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDemo}
                className="text-sm font-semibold text-blue-900 hover:underline flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
              >
                View Demonstration
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* SIH label */}
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-6">
              Smart India Hackathon 2026 · Prototype · Demonstration platform only
            </p>
          </div>

          {/* Right */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <AnalysisVisual />
          </div>
        </div>
      </section>

      {/* ── THREE CAPABILITIES ───────────────────────────────────────────── */}
      <section className="border-t border-b border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileSearch className="w-5 h-5" />,
                title: 'Evidence-Adaptive Planning',
                desc: 'Determines what evidence is required before analysis begins.',
                tags: 'Intent · Temporal · Spatial',
              },
              {
                icon: <Layers className="w-5 h-5" />,
                title: 'Multimodal Analysis',
                desc: 'Coordinates optical, SAR, temporal and GIS analysis automatically.',
                tags: 'Optical · SAR · GIS',
              },
              {
                icon: <GitMerge className="w-5 h-5" />,
                title: 'Challenge & Verification',
                desc: 'Checks whether the evidence consistently supports the result.',
                tags: 'Provenance · Invariants · Abstention',
              },
            ].map(cap => (
              <div key={cap.title} className="bg-white border border-slate-200 rounded p-5">
                <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 mb-4">
                  {cap.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{cap.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{cap.desc}</p>
                <p className="text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-2.5">{cap.tags}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">How It Works</h2>
        </div>

        {/* Horizontal process */}
        <div className="flex flex-wrap items-center justify-center gap-0">
          {[
            { step: 'Question',      color: 'bg-blue-900 text-white border-blue-900' },
            { step: 'Evidence Plan', color: 'bg-blue-800 text-white border-blue-800' },
            { step: 'Analyze',       color: 'bg-blue-700 text-white border-blue-700' },
            { step: 'Verify',        color: 'bg-blue-600 text-white border-blue-600' },
            { step: 'Answer',        color: 'bg-emerald-700 text-white border-emerald-700' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div className={`px-4 py-2 rounded border text-xs font-bold tracking-wide ${item.color}`}>
                {item.step}
              </div>
              {idx < arr.length - 1 && (
                <div className="flex items-center px-1">
                  <div className="h-px w-6 bg-slate-300" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 -ml-1" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-5 max-w-md mx-auto leading-relaxed">
          Users describe <strong className="text-slate-700">what</strong> they want to know.
          SatQuery determines <strong className="text-slate-700">how</strong> to analyze it.
        </p>
      </section>

      {/* ── DESIGNED FOR ─────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
            Designed for
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <Shield className="w-4 h-4" />,      label: 'Government' },
              { icon: <Wheat className="w-4 h-4" />,        label: 'Agriculture' },
              { icon: <Droplets className="w-4 h-4" />,     label: 'Disaster Management' },
              { icon: <Building2 className="w-4 h-4" />,    label: 'Urban Planning' },
              { icon: <Leaf className="w-4 h-4" />,         label: 'Environment' },
              { icon: <FlaskConical className="w-4 h-4" />, label: 'Research' },
              { icon: <Users className="w-4 h-4" />,        label: 'GIS Analysts' },
            ].map(u => (
              <div
                key={u.label}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700"
              >
                <span className="text-blue-800">{u.icon}</span>
                {u.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMONSTRATION STRIP ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                SatQuery in Action
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Example analysis query
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDemo}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              View Demonstration
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demo content */}
          <div className="p-6 bg-slate-50">
            {/* Query */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-7 h-7 rounded bg-slate-200 flex items-center justify-center shrink-0">
                <span className="text-slate-600 font-bold text-xs">Q</span>
              </div>
              <div className="bg-white border border-slate-200 rounded px-4 py-2.5 text-sm text-slate-800 font-medium flex-1">
                "Has the built-up area increased between these two dates, and does the available SAR evidence support it?"
              </div>
            </div>

            {/* Evidence chain */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {[
                { label: 'Before',            sub: '2022 Optical',       color: 'border-slate-300 text-slate-700' },
                null,
                { label: 'Change Detected',   sub: 'DeltaView Model',    color: 'border-blue-300 text-blue-800 bg-blue-50' },
                null,
                { label: 'Evidence Verified', sub: 'SAR Confirmed',      color: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
              ].map((item, idx) => {
                if (!item) return (
                  <ChevronRight key={idx} className="w-4 h-4 text-slate-300 shrink-0" />
                );
                return (
                  <div key={item.label} className={`px-3 py-2 bg-white border rounded text-center ${item.color}`}>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-slate-400">{item.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-900 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
            Access Earth Observation Analysis
          </h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Provide imagery. Ask a question. SatQuery handles the analysis.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="inline-flex items-center gap-2 px-7 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Shield className="w-4 h-4 text-blue-900" />
            Government Login
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left */}
            <div>
              <p className="text-sm font-bold text-slate-900">SATQUERY AI</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Earth Observation Intelligence Platform</p>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Footer links">
              {['About', 'Research', 'Help', 'Privacy', 'Accessibility'].map(link => (
                <button
                  key={link}
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
                >
                  {link}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Smart India Hackathon 2026 Prototype · Demonstration platform, not an official government service. ·
              Results produced are for evaluation purposes only and carry no legal or administrative authority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
