import React from "react";

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      {/* HERO */}
      <section className="bg-linear-to-r from-blue-900 via-indigo-800 to-purple-700 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 max-w-4xl mx-auto">
          Empowering Innovation, Technology & Talent Development
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200">
          Explore our services, programs, and digital platforms designed to
          accelerate growth.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl transition">
            Explore Services
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl transition">
            Join Programs
          </button>
          <button className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition">
            Access Portal
          </button>
        </div>
      </section>

      {/* QUICK CARDS */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Innovation Services",
            desc: "R&D, product development, consulting",
          },
          { title: "Programs", desc: "Internships, training, innovation labs" },
          {
            title: "Portal",
            desc: "Manage projects, track progress, resources",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 mb-4">{item.desc}</p>
            <button className="text-blue-600 font-medium">Learn More →</button>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Software Development",
            "AI Solutions",
            "IT Consulting",
            "Startup Support",
            "Cloud Systems",
            "Research & Innovation",
          ].map((service, i) => (
            <div
              key={i}
              className="p-6 border rounded-2xl hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{service}</h3>
              <p className="text-gray-500">
                High-quality solutions tailored to modern needs.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Our Programs</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Tech Internship Program",
            "Innovation Lab Challenge",
            "Advanced Skills Workshops",
          ].map((program, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg mb-2">{program}</h3>
              <p className="text-gray-500 mb-4">
                Apply now and boost your career.
              </p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PORTAL */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Smart Management Portal</h2>
        <p className="mb-6 text-gray-500">
          Track progress, manage tasks, and access resources anytime.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Login / Sign Up
        </button>
      </section>

      {/* STATS */}
      <section className="bg-linear-to-r from-blue-900 to-indigo-800 text-white py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold">500+</h3>
            <p>Trainees</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">50+</h3>
            <p>Projects</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">20+</h3>
            <p>Partners</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">10+</h3>
            <p>Programs</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Participants Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {["Amazing experience!", "Great learning environment!"].map(
            (text, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-600">"{text}"</p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition">
          Apply Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500">
        © 2026 Innovation Platform. All rights reserved.
      </footer>
    </div>
  );
}
