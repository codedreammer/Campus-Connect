import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import EventTicketCard from "../components/ui/EventTicketCard.jsx";
import { mockEvents, currentClubs } from "../data/mockData.js";

const upcoming = mockEvents.filter((e) => e.status === "upcoming").slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-ink-700">
        <div className="absolute inset-0 bg-dotted-ticket bg-[length:16px_16px] opacity-[0.06]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full border border-amber-500/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-amber-400">
              One campus. One ticket.
            </p>
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
              Every club event, registration and certificate — in one place.
            </h1>
            <p className="mt-4 max-w-xl text-base text-paper/70">
              Campus Connect replaces the scattered forms, WhatsApp broadcasts and
              spreadsheets with one system: browse events, register in a tap, walk in
              with a QR ticket, and download your certificate the moment it's issued.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Get your student ticket</Link>
              <Link to="/login" className="btn bg-white/10 text-paper hover:bg-white/20">
                I'm a club coordinator
              </Link>
            </div>
          </div>

          {/* decorative floating ticket — visual echo of the EventTicketCard signature */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-amber-500/10 blur-2xl" />
            <div className="relative mx-auto w-72 -rotate-3 rounded-2xl bg-paper p-5 shadow-2xl transition-transform duration-300 hover:rotate-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">Admit one</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink-700">Hackverse 5.0</h3>
              <p className="mt-0.5 text-xs text-slate">Robotics Club · CS Auditorium</p>
              <div className="my-4 border-t border-dashed border-ink-100" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate">14 Aug · 09:00 AM</p>
                  <p className="mt-1 font-mono text-xs text-ink-700">#CC-7X9K2M</p>
                </div>
                <div className="grid grid-cols-5 gap-[3px]">
                  {[1,0,1,1,0,0,1,0,1,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1].map((on, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-[1px] ${on ? "bg-ink-700" : "bg-ink-100"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mx-auto -mt-3 w-64 rotate-2 rounded-2xl bg-white/90 p-4 shadow-xl">
              <p className="text-xs font-semibold text-teal-600">✓ Checked in</p>
              <p className="mt-0.5 text-xs text-slate">Robotics Workshop: ROS Basics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
          {[
            ["18", "Active clubs"],
            ["92", "Events this year"],
            ["6,800+", "Tickets issued"],
            ["1,200+", "Students on board"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-semibold text-ink-700">{value}</p>
              <p className="text-xs text-slate">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Happening soon
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Upcoming on campus</h2>
          </div>
          <Link to="/login" className="text-sm font-semibold text-ink-700 hover:text-amber-600">
            View all events →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <h2 className="mb-10 text-2xl font-semibold">How Campus Connect works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "Discover & register", desc: "Browse events by club or category and grab a seat before it fills up.", icon: "🔎" },
              { title: "Walk in with a QR ticket", desc: "Your ticket is generated instantly — coordinators scan it at the door.", icon: "🎟️" },
              { title: "Get certified", desc: "Attendance is logged automatically, and certificates land in your account.", icon: "🏅" },
            ].map((step) => (
              <div key={step.title} className="card p-6 hover:shadow-md">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-xl">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-ink-700">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 className="mb-8 text-2xl font-semibold">Clubs on Campus Connect</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentClubs.map((club) => (
            <div key={club.id} className="card p-5 hover:shadow-md">
              <p className="badge-amber mb-3 inline-flex">{club.category}</p>
              <h3 className="font-semibold text-ink-700">{club.name}</h3>
              <p className="mt-1 text-xs text-slate">
                {club.members} members · {club.events} events this year
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100 py-8 text-center text-xs text-slate">
        Campus Connect — built for the IIT Jammu MERN internship final project.
      </footer>
    </div>
  );
}
