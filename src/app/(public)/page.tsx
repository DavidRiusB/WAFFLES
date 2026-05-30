"use client";

import Link from "next/link";
import {
  Monitor,
  Wifi,
  HardDrive,
  Wrench,
  GraduationCap,
  MessageCircle,
  Home,
  CheckCircle2,
  MapPin,
  Mail,
  ShieldCheck,
  Tag,
  BookOpen,
  Truck,
  FileText,
} from "lucide-react";
import { useUser } from "@/src/context/user-context";

export default function LandingPage() {
  const { user, logout } = useUser();
  const isSignedIn = !!user;

  return (
    <div className="w-full bg-white text-black">
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 flex flex-col items-start gap-6">
          <span className="inline-block bg-yellow-400 text-black text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
            Serving Tooele County, Utah
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
            Tech help that comes to your door.
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
            Hardware, networking, and computer support for homes in the Tooele
            area — explained so it makes sense, and done right the first time.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="border border-gray-500 text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="border border-gray-500 text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">What we do</h2>
            <p className="mt-3 text-gray-600">
              On-site service for the everyday tech in your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon={<Monitor className="h-6 w-6" />}
              title="Computer Repair"
              body="Slow, crashing, or just broken? Diagnostics and repairs for desktops and laptops."
            />
            <ServiceCard
              icon={<HardDrive className="h-6 w-6" />}
              title="Hardware Installation"
              body="New PC, printer, smart TV, or peripheral — setup, cabling, and configuration handled."
            />
            <ServiceCard
              icon={<Wifi className="h-6 w-6" />}
              title="Wi-Fi & Networking"
              body="Dead zones, weak signal, or a fresh setup. Routers, mesh systems, and secure configuration."
            />
            <ServiceCard
              icon={<Wrench className="h-6 w-6" />}
              title="Connectivity Troubleshooting"
              body="Internet down, devices that won't talk to each other, mystery errors. I find the cause and fix it."
            />
            <ServiceCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Tech Coaching"
              body="One-on-one help for the software, devices, and services you use every day."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Pricing</h2>
            <p className="mt-3 text-gray-600">
              Transparent rates. You know what it costs before any work starts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <RateCard
              label="Standard hourly rate"
              price="$75"
              unit="/hr"
              note="One-hour minimum, billed in 30-minute increments after that."
            />
            <RateCard
              label="Diagnostic / trip fee"
              price="$50"
              note="Credited in full toward your bill if you proceed with service."
            />

            <div className="bg-black text-white rounded-xl p-6 flex flex-col">
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Example · 1 hour of work
              </div>
              <div className="mt-3 space-y-1.5 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-300">Trip fee</span>
                  <span>$50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hourly labor (1 hr)</span>
                  <span>$75</span>
                </div>
                <div className="flex justify-between text-yellow-400">
                  <span>Trip fee credited</span>
                  <span>−$50</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-baseline">
                <span className="text-sm text-gray-400">You pay</span>
                <span className="text-3xl font-bold text-yellow-400">$75</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2">Flat-rate packages</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-2xl">
            Labor only. Parts, hardware, and software licenses are billed at
            cost with an itemized estimate before purchase.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PackageCard title="New computer setup" price="$130" />
            <PackageCard title="Home Wi-Fi & network setup" price="$140" />
            <PackageCard title="Virus & malware removal" price="$150" />
            <PackageCard title="Data transfer & migration" price="$100" />
            <PackageCard title="OS reinstall / system refresh" price="$160" />
            <PackageCard title="Printer setup" price="$75" />
            <PackageCard
              title="Hardware upgrade install"
              price="$75"
              subtitle="labor only · parts billed separately"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex gap-3">
              <Truck className="h-5 w-5 mt-0.5 text-black flex-shrink-0" />
              <p>
                Service within 15 miles of Tooele is covered by the trip fee.
                Beyond that, $0.70/mile round-trip — or a custom quote for
                larger jobs.
              </p>
            </div>
            <div className="flex gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-black flex-shrink-0" />
              <p>
                Jobs that don&apos;t fit a package are quoted hourly or as a
                custom flat rate before any work starts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="mt-3 text-gray-600">
              Straightforward, start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step={1}
              icon={<MessageCircle className="h-6 w-6" />}
              title="Consult"
              body="Tell me what's going on. We agree on scope and pricing before any work starts."
            />
            <StepCard
              step={2}
              icon={<Home className="h-6 w-6" />}
              title="On-site Visit"
              body="I come to your home with the tools and parts needed to get the job done."
            />
            <StepCard
              step={3}
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Follow-up"
              body="I check back to make sure it's still working — because the job isn't done when I leave."
            />
          </div>
        </div>
      </section>

      {/* Why EgalisysTech */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Why EgalisysTech</h2>
            <p className="mt-3 text-gray-600">
              Built around the kind of service I&apos;d want at my own house.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Local & owner-operated"
              body="You're talking directly to the person doing the work. No call centers, no scripts."
            />
            <ValueCard
              icon={<Tag className="h-6 w-6" />}
              title="Transparent pricing"
              body="You know what it costs before I start. No surprise charges, no upsells."
            />
            <ValueCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Education-focused"
              body="I explain what I'm doing in plain language, so you know what changed and why."
            />
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-yellow-400 text-black p-3 rounded-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Service area</h2>
            <p className="mt-1 text-gray-700 max-w-2xl">
              Serving Tooele, Grantsville, Stockton, Erda, and Lakepoint. Not
              sure if you&apos;re in range? Reach out and I&apos;ll let you
              know.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-black text-yellow-400 p-3 rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Get in touch</h2>
            <p className="mt-1 text-gray-700 max-w-2xl">
              Have a question before booking? Email{" "}
              <a
                href="mailto:support@egalisystech.com"
                className="font-semibold underline decoration-yellow-400 decoration-2 underline-offset-2 hover:text-black"
              >
                support@egalisystech.com
              </a>
              . Service is by appointment — once you book, I&apos;ll reach out
              to confirm your time.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-yellow-400 text-black">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready for tech that just works?
            </h2>
            <p className="mt-2 text-black/80 max-w-xl">
              {isSignedIn
                ? "Head to your dashboard to schedule your next visit."
                : "Create an account in a couple of minutes and book your first visit."}
            </p>
          </div>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <div className="inline-flex items-center justify-center bg-yellow-400 text-black p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{body}</p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  body,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-black text-yellow-400 font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm">
          {step}
        </div>
        <div className="text-gray-500">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{body}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex items-center justify-center bg-black text-yellow-400 p-3 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{body}</p>
    </div>
  );
}

function RateCard({
  label,
  price,
  unit,
  note,
}: {
  label: string;
  price: string;
  unit?: string;
  note: string;
}) {
  return (
    <div className="bg-black text-white rounded-xl p-6">
      <div className="text-sm text-gray-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-yellow-400">{price}</span>
        {unit && <span className="text-gray-400">{unit}</span>}
      </div>
      <p className="mt-3 text-sm text-gray-300">{note}</p>
    </div>
  );
}

function PackageCard({
  title,
  price,
  subtitle,
}: {
  title: string;
  price: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-sm font-medium text-gray-700">{title}</div>
      <div className="mt-2 text-2xl font-bold">{price}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
}
