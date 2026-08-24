import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CloudCog,
  Cpu,
  LineChart,
  LockKeyhole,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Moon,
  Network,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { GOOGLE_DRIVE_VIDEO_URL } from "./config/video.js";
import { caseStudies, demos, faqs, industries, navItems, services, technologies, testimonials } from "./data/siteData.jsx";
import "./styles.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getGoogleDriveVideoSources(url) {
  const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1] || url.match(/[?&]id=([^&]+)/)?.[1];

  if (!fileId) {
    return {
      previewUrl: "",
      streamUrls: [url],
    };
  }

  return {
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    streamUrls: [
      `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
      `https://drive.google.com/uc?export=download&id=${fileId}`,
    ],
  };
}

function getDemoVideoSources(url) {
  try {
    const parsedUrl = new globalThis.URL(url);
    const isGoogleDrive = parsedUrl.hostname === "drive.google.com" || parsedUrl.hostname === "drive.usercontent.google.com";

    if (!isGoogleDrive) {
      return { streamUrls: [], fallbackUrl: url };
    }

    const fileId = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || parsedUrl.searchParams.get("id");

    if (!fileId) {
      return { streamUrls: [], fallbackUrl: url };
    }

    return {
      streamUrls: [
        `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
        `https://drive.google.com/uc?export=download&id=${fileId}`,
      ],
      fallbackUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  } catch {
    return { streamUrls: [], fallbackUrl: url };
  }
}

function formatVideoTime(value) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const routerBasename = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter basename={routerBasename}>
      <div className="min-h-screen bg-slate-50 font-body text-slate-900 antialiased transition-colors dark:bg-navy-950 dark:text-white">
        <SeoUpdater />
        <ScrollToTop />
        <Navbar dark={dark} setDark={setDark} />
        <AnimatePresence mode="wait">
          <AnimatedRoutes />
        </AnimatePresence>
        <FloatingContact />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageShell><Home /></PageShell>} />
      <Route path="/services" element={<PageShell><Services /></PageShell>} />
      <Route path="/services/:serviceSlug" element={<PageShell><ServiceSingle /></PageShell>} />
      <Route path="/demo-center" element={<PageShell><DemoCenter /></PageShell>} />
      <Route path="/industries" element={<PageShell><Industries /></PageShell>} />
      <Route path="/about" element={<PageShell><About /></PageShell>} />
      <Route path="/careers" element={<PageShell><Careers /></PageShell>} />
      <Route path="/contact" element={<PageShell><Contact /></PageShell>} />
    </Routes>
  );
}

function PageShell({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.main
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.main>
  );
}

function SeoUpdater() {
  const { pathname } = useLocation();
  const titles = {
    "/": "Amsun Technology Private Limited | Secure AI ERP, Cloud & Cybersecurity",
    "/services": "IT Services | Odoo ERP, AI, Cybersecurity, Cloud & CRM",
    "/demo-center": "ERP & CRM Demo Center | Amsun Technology",
    "/industries": "Industries Served | Amsun Technology",
    "/about": "About Amsun Technology Private Limited",
    "/careers": "Careers | Amsun Technology",
    "/contact": "Contact Amsun Technology",
  };
  useEffect(() => {
    document.title = titles[pathname] || titles["/"];
    document.querySelector("meta[name='description']")?.setAttribute(
      "content",
      "Amsun Technology Private Limited delivers secure AI-powered ERP, Odoo, CRM, cloud, DevOps and cybersecurity solutions for US and UK businesses."
    );
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);
  return null;
}

function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 shadow-sm backdrop-blur-xl dark:bg-navy-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3" aria-label="Amsun Technology home">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-navy-900 text-lg font-black text-cyanbrand-400 shadow-glow">A</span>
          <span>
            <span className="block font-heading text-base font-bold tracking-tight">Amsun Technology</span>
            <span className="block text-xs font-semibold text-cyan-600 dark:text-cyanbrand-300">Private Limited</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => (
            label === "Home" ? (
              <Link
                key={href}
                to="/"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition",
                  location.pathname === "/"
                    ? "bg-cyan-100 text-navy-900 dark:bg-cyanbrand-500/[0.14] dark:text-cyanbrand-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-200 dark:hover:bg-white/[0.08]"
                )}
              >
                Home
              </Link>
            ) : label === "Services" ? (
              <div
                key={href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <NavLink
                  to={href}
                  onFocus={() => setServicesOpen(true)}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-cyan-100 text-navy-900 dark:bg-cyanbrand-500/[0.14] dark:text-cyanbrand-300"
                        : "text-slate-600 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-200 dark:hover:bg-white/[0.08]"
                    )
                  }
                >
                  Services <ChevronDown size={15} />
                </NavLink>
                {servicesOpen && (
                  <div className="absolute left-0 top-full w-72 pt-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-enterprise dark:border-white/10 dark:bg-navy-900">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.title}
                            to={`/services/${slugify(service.title)}`}
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-navy-900 dark:text-slate-200 dark:hover:bg-white/[0.08] dark:hover:text-cyanbrand-300"
                          >
                            <Icon size={18} className="text-cyan-500" />
                            {service.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-cyan-100 text-navy-900 dark:bg-cyanbrand-500/[0.14] dark:text-cyanbrand-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-200 dark:hover:bg-white/[0.08]"
                  )
                }
              >
                {label}
              </NavLink>
            )
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/contact" className="hidden rounded-md bg-cyanbrand-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-glow transition hover:-translate-y-0.5 sm:inline-flex">
            Book Consultation
          </Link>
          <button className="icon-button lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto overscroll-contain border-t border-slate-200/70 bg-white/68 px-4 py-3 shadow-enterprise backdrop-blur-2xl dark:border-white/10 dark:bg-navy-950/72 lg:hidden">
          <div className="grid gap-1 pb-6">
            {navItems.map(([label, href]) => (
              <div key={href}>
                {label === "Home" ? (
                  <Link to="/" onClick={() => setOpen(false)} className="block rounded-md bg-white/64 px-3 py-3 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white/85 dark:bg-navy-900/64 dark:hover:bg-navy-900/85">
                    Home
                  </Link>
                ) : label === "Services" ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md bg-white/64 px-3 py-3 text-left text-sm font-semibold shadow-sm backdrop-blur hover:bg-white/85 dark:bg-navy-900/64 dark:hover:bg-navy-900/85"
                    onClick={() => setMobileServicesOpen((current) => !current)}
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown size={17} className={cn("transition-transform", mobileServicesOpen && "rotate-180")} />
                  </button>
                ) : (
                  <NavLink to={href} onClick={() => setOpen(false)} className="block rounded-md bg-white/64 px-3 py-3 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white/85 dark:bg-navy-900/64 dark:hover:bg-navy-900/85">
                    {label}
                  </NavLink>
                )}
                {label === "Services" && mobileServicesOpen && (
                  <div className="ml-3 grid gap-1 border-l border-slate-200 pl-3 dark:border-white/10">
                    <Link
                      to="/services"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white/50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur hover:bg-white/80 dark:bg-navy-900/55 dark:text-slate-200 dark:hover:bg-navy-900/80"
                    >
                      All Services
                    </Link>
                    {services.map((service) => (
                      <Link
                        key={service.title}
                        to={`/services/${slugify(service.title)}`}
                        onClick={() => setOpen(false)}
                        className="rounded-md bg-white/42 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur hover:bg-white/75 dark:bg-navy-900/48 dark:text-slate-200 dark:hover:bg-navy-900/75"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Section({ eyebrow, title, text, children, className = "" }) {
  return (
    <section className={cn("section", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || text) && (
          <Reveal className="mx-auto mb-12 max-w-3xl text-center">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="heading-lg">{title}</h2>}
            {text && <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

function Reveal({ children, className = "", delay = 0, ...props }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      {...props}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <TrustProof />
      <ServicesOverview />
      <EnterpriseExperience />
      <WhyChoose />
      <DeliveryGovernance />
      <TechStack />
      <IndustriesPreview />
      <CaseStudies />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-50 text-navy-950">
      <HeroOfficeBackground />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-cyan-100/20" />
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-white/70 px-3 py-2 text-sm font-semibold text-cyan-700 shadow-enterprise backdrop-blur">
            <Sparkles size={16} /> Secure AI-Powered ERP, Cloud & Cybersecurity Solutions
          </div>
          <h1 className="mt-7 max-w-5xl font-heading text-4xl font-extrabold leading-tight text-navy-950 [text-shadow:0_8px_28px_rgba(255,255,255,.82)] sm:text-5xl lg:text-6xl">
            Transform Your Business with Secure AI-Powered ERP & Cloud Solutions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            We help businesses automate operations, secure infrastructure, and scale globally using AI, ERP, Cybersecurity and Cloud technologies.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="primary-button">Book Free Consultation <ArrowRight size={18} /></Link>
            <Link to="/demo-center" className="hero-light-button">Schedule ERP Demo <Play size={18} /></Link>
            <Link to="/contact" className="hero-light-button">Get Security Audit <ShieldCheck size={18} /></Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center">
            {["US/UK Ready", "AI-Led Delivery", "Security First"].map((item) => (
              <div key={item} className="rounded-lg border border-cyan-200 bg-white/70 p-3 text-sm font-bold text-navy-900 shadow-enterprise backdrop-blur">{item}</div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroOfficeBackground() {
  const videoRef = useRef(null);
  const [showPreviewFallback, setShowPreviewFallback] = useState(false);
  const [previewLoopKey, setPreviewLoopKey] = useState(0);
  const heroVideoSources = getGoogleDriveVideoSources(GOOGLE_DRIVE_VIDEO_URL);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || showPreviewFallback) {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      if (video.readyState < 2) {
        setShowPreviewFallback(Boolean(heroVideoSources.previewUrl));
      }
    }, 10);

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0.08;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {
      setShowPreviewFallback(Boolean(heroVideoSources.previewUrl));
    });

    const enableLowVolumeAudio = () => {
      video.muted = false;
      video.volume = 0.08;
      video.play().catch(() => {
        video.muted = true;
      });
    };

    window.addEventListener("pointerdown", enableLowVolumeAudio, { once: true });

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("pointerdown", enableLowVolumeAudio);
    };
  }, [heroVideoSources.previewUrl, showPreviewFallback]);

  useEffect(() => {
    if (!showPreviewFallback) {
      return undefined;
    }

    // Google Drive's preview embed does not reliably honor the native loop attribute.
    const previewLoopTimer = window.setInterval(() => {
      setPreviewLoopKey((currentKey) => currentKey + 1);
    }, 19500);

    return () => window.clearInterval(previewLoopTimer);
  }, [showPreviewFallback]);

  const replayVideo = (video) => {
    video.currentTime = 0;
    video.play().catch(() => {
      setShowPreviewFallback(Boolean(heroVideoSources.previewUrl));
    });
  };

  return (
    <div className="hero-office-bg" aria-hidden="true">
      <div className="hero-video-frame">
        {showPreviewFallback && heroVideoSources.previewUrl ? (
          <iframe
            key={previewLoopKey}
            className="hero-drive-preview"
            src={`${heroVideoSources.previewUrl}?autoplay=1&mute=1&loop=1`}
            title="Amsun Technology project confirmation video"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="hero-real-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(event) => {
              event.currentTarget.volume = 0.08;
              event.currentTarget.play().catch(() => {
                setShowPreviewFallback(Boolean(heroVideoSources.previewUrl));
              });
            }}
            onEnded={(event) => replayVideo(event.currentTarget)}
            onError={() => {
              setShowPreviewFallback(Boolean(heroVideoSources.previewUrl));
            }}
          >
            {heroVideoSources.streamUrls.map((sourceUrl) => (
              <source key={sourceUrl} src={sourceUrl} />
            ))}
          </video>
        )}
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-xl">
      <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity }} className="floating-card left-0 top-4">
        <LockKeyhole size={18} /> Threat risk -28%
      </motion.div>
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity }} className="floating-card right-0 top-24">
        <Zap size={18} /> AI workflow live
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="floating-card bottom-10 left-8">
        <CloudCog size={18} /> Cloud uptime 99.99%
      </motion.div>
      <div className="glass-panel overflow-hidden rounded-2xl border border-white/[0.16]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-cyanbrand-300">Amsun Command Center</p>
            <p className="text-xs text-slate-300">ERP + AI + Security telemetry</p>
          </div>
          <div className="flex gap-2"><span className="dot bg-rose-400" /><span className="dot bg-amber-300" /><span className="dot bg-emerald-400" /></div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-4">
            <div className="rounded-xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Revenue Operations</p>
                <span className="text-xs text-emerald-300">+32%</span>
              </div>
              <div className="mt-5 flex h-32 items-end gap-2">
                {[38, 54, 48, 66, 74, 62, 86, 94].map((height, i) => (
                  <span key={height + i} className="flex-1 rounded-t bg-gradient-to-t from-cyanbrand-500 to-white/90" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["ERP", "CRM", "SOC"].map((item) => <div key={item} className="rounded-lg bg-white/10 p-3 text-center text-sm font-bold">{item}</div>)}
            </div>
          </div>
          <div className="space-y-4">
            {[
              ["AI tickets resolved", "78%", Cpu],
              ["Security score", "94/100", ShieldCheck],
              ["Cloud spend saved", "$18k", LineChart],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-xl bg-white/10 p-4">
                <Icon className="text-cyanbrand-300" size={20} />
                <p className="mt-3 text-xs text-slate-300">{label}</p>
                <p className="text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustProof() {
  const proof = [
    ["Discovery-first consulting", "We begin with business process mapping, risk review and a clear implementation roadmap before writing code."],
    ["Secure delivery habits", "Access control, audit trails, backups, environment separation and deployment checks are built into project delivery."],
    ["Global communication", "Structured updates, milestone reviews and timezone-friendly collaboration for US, UK and India stakeholders."],
    ["Outcome ownership", "Every engagement is tied to operational metrics like cycle time, automation rate, uptime, lead conversion or security posture."],
  ];

  return (
    <Section className="bg-white dark:bg-navy-900/50" eyebrow="Built For Trust" title="A technology partner visitors can evaluate in minutes" text="Amsun presents the signals enterprise buyers expect: process clarity, security awareness, measurable outcomes and responsive delivery. The website is designed to help decision-makers quickly understand what we do, how we work and why we are credible.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {proof.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.04} className="card p-6">
            <ShieldCheck className="text-cyan-500" size={28} />
            <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ServicesOverview() {
  return (
    <Section eyebrow="Services" title="Enterprise technology services built around measurable outcomes">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => <ServiceCard key={service.title} service={service} delay={i * 0.04} />)}
      </div>
    </Section>
  );
}

function EnterpriseExperience() {
  const stages = [
    ["Assess", "We study workflows, applications, integrations, infrastructure and security exposure to identify the highest-value improvements."],
    ["Architect", "We design ERP, CRM, AI and cloud solutions around scalability, permissions, reporting, data quality and supportability."],
    ["Implement", "We deliver in controlled sprints with demos, UAT cycles, documentation and clean handover checkpoints."],
    ["Operate", "We help clients keep improving through monitoring, optimization, support, analytics and automation backlog planning."],
  ];

  return (
    <Section eyebrow="Enterprise Experience" title="From first workshop to long-term operations" text="Visitors should feel they are meeting a real delivery team, not a template. Our approach reflects how serious IT programs are actually run: define the outcome, reduce risk, implement in phases and keep improving after go-live.">
      <div className="grid gap-5 lg:grid-cols-4">
        {stages.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.05} className="enterprise-stage-card group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-enterprise dark:border-white/10 dark:bg-white/[0.055]">
            <span className="absolute right-5 top-4 font-heading text-6xl font-black text-cyan-500/10">0{i + 1}</span>
            <div className="relative">
              <Cpu className="text-cyan-500 transition duration-300 group-hover:scale-125 group-hover:text-cyanbrand-500" size={28} />
              <h3 className="mt-5 font-heading text-xl font-bold transition duration-300 group-hover:text-2xl group-hover:text-navy-900 dark:group-hover:text-cyanbrand-300">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600 transition duration-300 group-hover:font-semibold group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ServiceCard({ service, delay = 0 }) {
  const Icon = service.icon;
  return (
    <Reveal delay={delay} className="group h-full">
      <Link to={`/services/${slugify(service.title)}`} className="block h-full" aria-label={`Explore ${service.title}`}>
        <article className="card h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyanbrand-500/12 text-cyan-600 dark:text-cyanbrand-300">
            <Icon size={24} />
          </div>
          <h3 className="mt-5 font-heading text-xl font-bold">{service.title}</h3>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{service.summary}</p>
          <ul className="mt-5 space-y-2">
            {service.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-0.5 shrink-0 text-cyan-500" size={16} />{feature}</li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition group-hover:gap-3 dark:text-cyanbrand-300">Explore service <ArrowRight size={16} /></span>
        </article>
      </Link>
    </Reveal>
  );
}

function WhyChoose() {
  const items = [
    ["Security-first architecture", "Every ERP, AI and cloud engagement includes access control, logging and risk controls from day one."],
    ["Senior delivery model", "A lean team of consultants, engineers and analysts keeps ownership clear and delivery fast."],
    ["US/UK lead-generation focus", "Solutions are shaped for global buyers, compliance expectations and executive reporting."],
    ["Automation with governance", "AI workflows include human approval paths, traceability and measurable ROI targets."],
  ];
  return (
    <Section className="bg-white dark:bg-navy-900/50" eyebrow="Why Choose Us" title="Consulting discipline with implementation depth">
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.05} className="card p-6">
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-900 text-cyanbrand-300">{i + 1}</span>
              <div><h3 className="font-heading text-xl font-bold">{title}</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{text}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function DeliveryGovernance() {
  const controls = [
    ["Executive visibility", "Weekly progress summaries, blockers, decisions, risks and milestone health are reported in plain business language."],
    ["Security checkpoints", "Credential handling, least-privilege access, audit logs, backup readiness and hardening checks are reviewed throughout delivery."],
    ["Quality assurance", "Configuration reviews, test cases, UAT signoff, migration rehearsal and rollback planning reduce surprises at launch."],
    ["Adoption support", "Training, SOPs, role-based dashboards and post-go-live assistance help teams actually use the systems built for them."],
  ];

  return (
    <Section className="bg-slate-100 dark:bg-navy-900/40" eyebrow="Delivery Governance" title="Designed for buyers who care about risk, adoption and accountability">
      <div className="grid gap-5 md:grid-cols-2">
        {controls.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.04} className="card p-7">
            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyanbrand-500/12 text-cyan-600 dark:text-cyanbrand-300">
                {i % 2 === 0 ? <BarChart3 size={23} /> : <LockKeyhole size={23} />}
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TechStack() {
  return (
    <Section eyebrow="Technology Stack" title="Modern platforms your team already trusts">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {technologies.map((tech, i) => (
          <Reveal key={tech} delay={i * 0.03} className="tech-logo">
            <Network size={22} className="text-cyan-500" />
            <span>{tech}</span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function IndustriesPreview() {
  return (
    <Section className="bg-slate-100 dark:bg-navy-900/40" eyebrow="Industries Served" title="Industry-specific operating systems, not generic software">
      <IndustryGrid />
    </Section>
  );
}

function IndustryGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {industries.map(([title, Icon, text], i) => (
        <Reveal key={title} delay={i * 0.04} className="group card min-h-72 overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
          <div className="flex h-full min-h-72 flex-col items-center justify-center p-8 text-center transition duration-300 group-hover:-translate-y-4">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-cyanbrand-500/12 text-cyan-600 transition duration-300 group-hover:scale-110 group-hover:bg-cyanbrand-500 group-hover:text-navy-950 dark:text-cyanbrand-300">
              <Icon size={48} />
            </div>
            <h3 className="mt-6 font-heading text-2xl font-bold">{title}</h3>
            <div className="mt-5 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-48 group-hover:opacity-100">
              <p className="leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              <p className="mt-4 rounded-lg bg-cyanbrand-500/10 px-4 py-3 text-sm font-bold text-cyan-700 dark:text-cyanbrand-300">
                Industry-ready ERP, cloud, CRM and security workflows.
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function CaseStudies() {
  return (
    <Section eyebrow="Case Studies" title="Transformation stories shaped around business value">
      <div className="grid gap-5 lg:grid-cols-3">
        {caseStudies.map(([client, result], i) => (
          <Reveal key={client} delay={i * 0.05} className="card p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyanbrand-300">{client}</p>
            <h3 className="mt-4 font-heading text-2xl font-bold leading-tight">{result}</h3>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section className="bg-white dark:bg-navy-900/50" eyebrow="Testimonials" title="Built for executives, operators and technical teams">
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map(([person, quote], i) => (
          <Reveal key={person} delay={i * 0.05} className="card p-7">
            <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">"{quote}"</p>
            <p className="mt-5 text-sm font-bold text-cyan-600 dark:text-cyanbrand-300">{person}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  return (
    <Section eyebrow="FAQ" title="Questions procurement and technology leaders usually ask">
      <div className="mx-auto max-w-4xl divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
        {faqs.map(([q, a]) => <FAQItem key={q} question={q} answer={a} />)}
      </div>
    </Section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-heading text-lg font-bold" onClick={() => setOpen(!open)}>
        {question}<ChevronDown className={cn("shrink-0 transition", open && "rotate-180")} size={20} />
      </button>
      {open && <p className="px-5 pb-5 leading-7 text-slate-600 dark:text-slate-300">{answer}</p>}
    </div>
  );
}

function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="Secure ERP, AI, cloud and cybersecurity delivery under one roof" text="Each service combines strategy, engineering, controls and managed support so your teams can move faster without adding operational risk." />
      <ServiceTrustIntro />
      <Section>
        <div className="space-y-8">
          {services.map((service, i) => (
            <div key={service.title} className="space-y-6">
              <ServiceDetail service={service} flipped={i % 2 === 1} />
              <ServiceExpandedContent service={service} />
            </div>
          ))}
        </div>
      </Section>
      <ServiceStrategicDetails />
      <EngagementModels />
      <ContactCTA />
    </>
  );
}

function ServiceTrustIntro() {
  return (
    <Section className="bg-white dark:bg-navy-900/50" eyebrow="How We Help" title="Services shaped for real business operations" text="Amsun Technology Private Limited helps organizations replace disconnected tools, manual approvals and security blind spots with integrated systems. Whether a client needs Odoo ERP, CRM, AI automation, cloud infrastructure or cybersecurity support, we focus on practical implementation, clean ownership and measurable improvement.">
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Business process depth", "We document how teams sell, procure, fulfill, support and report before designing systems."],
          ["Technical integration", "We connect ERP, CRM, cloud, analytics and security tools with stable APIs and controlled data flows."],
          ["Post-launch reliability", "We plan support, monitoring, training and optimization so the solution keeps improving after launch."],
        ].map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.04} className="card p-7">
            <Network className="text-cyan-500" size={30} />
            <h3 className="mt-4 font-heading text-xl font-bold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EngagementModels() {
  const models = [
    ["Fixed-scope implementation", "Best for Odoo modules, CRM rollout, cloud migration or security hardening with clear deliverables and timeline."],
    ["Dedicated monthly team", "Best for companies that need ongoing ERP changes, DevOps support, AI automation backlog and reporting improvements."],
    ["Audit and advisory sprint", "Best for leadership teams that need a fast ERP, cloud, AI or cybersecurity roadmap before investing in execution."],
  ];

  return (
    <Section className="bg-navy-950 text-white" eyebrow="Engagement Models" title="Flexible ways to start with confidence" text="Clients can begin with a focused audit, a pilot implementation or a managed monthly partnership. The goal is to create momentum without forcing unnecessary complexity.">
      <div className="grid gap-5 lg:grid-cols-3">
        {models.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.04} className="rounded-xl border border-white/10 bg-white/[0.08] p-7">
            <p className="font-heading text-4xl font-black text-cyanbrand-300">0{i + 1}</p>
            <h3 className="mt-4 font-heading text-xl font-bold">{title}</h3>
            <p className="mt-3 leading-7 text-slate-300">{text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const serviceStrategyDetails = {
  "Odoo ERP Solutions": {
    promise: "We help businesses move from scattered spreadsheets, disconnected departments and delayed reporting into a controlled ERP operating model. Odoo becomes the central system where finance, inventory, sales, purchasing, HR and approvals work together with cleaner data and stronger accountability.",
    outcomes: ["Single operational source of truth", "Faster approvals and month-end reporting", "Better inventory, procurement and cash-flow visibility"],
    useCases: ["ERP implementation for growing businesses", "Migration from manual spreadsheets or legacy tools", "Custom Odoo workflows for finance, inventory, HRMS, POS and CRM"],
    line: "A well-implemented ERP does more than digitize work. It gives leadership the confidence to scale without losing control.",
  },
  "AI Automation": {
    promise: "We design AI automation around real operational bottlenecks, not hype. The goal is to reduce repetitive work, accelerate response times and give teams intelligent assistance while keeping approvals, data privacy and human oversight in place.",
    outcomes: ["Lower manual workload across support, sales and operations", "Smarter document handling and workflow routing", "Faster decisions with AI-assisted insights"],
    useCases: ["AI assistants for internal teams", "Document extraction and classification", "Lead follow-up automation and customer-service workflows"],
    line: "AI should feel like a reliable operations layer: useful, controlled, measurable and safe enough for business users to trust.",
  },
  "Cybersecurity Services": {
    promise: "We help companies identify risk, harden systems and build practical security monitoring around their business environment. Our cybersecurity work is designed for leadership visibility, technical remediation and continuous improvement.",
    outcomes: ["Clear risk posture and remediation priorities", "Stronger endpoint, cloud and application controls", "Better readiness for audits, clients and compliance reviews"],
    useCases: ["Security posture assessment", "Cloud and infrastructure hardening", "SOC monitoring, incident response planning and vulnerability coordination"],
    line: "Security is not only a technical requirement. It is a business trust signal that protects revenue, reputation and continuity.",
  },
  "Cloud & DevOps": {
    promise: "We build cloud and DevOps foundations that help teams release faster, operate reliably and control infrastructure cost. From migration to CI/CD automation, we focus on repeatable environments and operational resilience.",
    outcomes: ["Reliable deployments with less release risk", "Scalable infrastructure for growing traffic and workloads", "Improved observability, uptime and cost control"],
    useCases: ["AWS and Azure landing zones", "Docker and Kubernetes modernization", "CI/CD pipelines, monitoring, backup and disaster recovery planning"],
    line: "Strong cloud architecture gives the business freedom to grow while giving engineering the discipline to operate safely.",
  },
  "CRM Solutions": {
    promise: "We help sales and service teams manage the full customer journey with better visibility, cleaner follow-ups and stronger pipeline discipline. CRM should make revenue teams sharper, not slower.",
    outcomes: ["Improved lead tracking and conversion visibility", "Better customer history and account ownership", "More predictable sales forecasting and follow-up discipline"],
    useCases: ["Odoo CRM implementation", "Lead scoring and pipeline automation", "Customer 360, service workflows and marketing integrations"],
    line: "A strong CRM turns scattered conversations into a repeatable revenue process your team can measure and improve.",
  },
  "Data Analytics": {
    promise: "We transform operational data into dashboards and decision systems that leaders can rely on. Instead of waiting for manual reports, teams get timely metrics across finance, sales, inventory, support and delivery.",
    outcomes: ["Executive dashboards for faster decisions", "Cleaner KPIs and reporting definitions", "Automated reporting across ERP, CRM and cloud systems"],
    useCases: ["BI dashboard development", "Data modeling and KPI governance", "Automated reports for operations, finance and leadership reviews"],
    line: "Data becomes valuable when it is trusted, timely and connected to the decisions people actually need to make.",
  },
  "Website & Application Development": {
    promise: "We create polished websites and secure business applications that make a strong first impression while supporting real workflows behind the scenes. From an enterprise marketing site to a client portal or internal operations platform, we combine clear user experience, reliable engineering and integrations that fit your business.",
    outcomes: ["A credible digital presence that earns buyer trust", "Faster self-service journeys for customers and teams", "A maintainable application foundation ready to grow"],
    useCases: ["Corporate websites and lead-generation platforms", "Customer portals, dashboards and internal business applications", "ERP, CRM, payment, cloud and third-party API integrations"],
    line: "Your website and application should feel premium to users, dependable to your team and connected to the systems that run the business.",
  },
};

function ServiceStrategicDetails() {
  return (
    <Section className="bg-white dark:bg-navy-900/50" eyebrow="Service Depth" title="Strategic details behind every capability" text="Below is how each service translates into business value, operational control and measurable improvement for clients who want more than a vendor.">
      <div className="space-y-8">
        {services.map((service, i) => {
          const details = serviceStrategyDetails[service.title];
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={i * 0.03} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-enterprise dark:border-white/10 dark:bg-white/[0.055]">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="dashboard-tile p-7 text-white sm:p-9">
                  <Icon className="text-cyanbrand-300" size={34} />
                  <h3 className="mt-5 font-heading text-3xl font-bold">{service.title}</h3>
                  <p className="mt-5 text-lg leading-8 text-slate-200">{details.line}</p>
                  <Link to={`/services/${slugify(service.title)}`} className="secondary-button mt-7">Open Service Page <ArrowRight size={18} /></Link>
                </div>
                <div className="p-7 sm:p-9">
                  <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">{details.promise}</p>
                  <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-heading text-lg font-bold">Business Outcomes</h4>
                      <ul className="mt-4 space-y-3">
                        {details.outcomes.map((item) => (
                          <li key={item} className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="mt-1 shrink-0 text-cyan-500" size={18} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-bold">Practical Use Cases</h4>
                      <ul className="mt-4 space-y-3">
                        {details.useCases.map((item) => (
                          <li key={item} className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="mt-1 shrink-0 text-cyan-500" size={18} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ServiceSingle() {
  const { serviceSlug } = useParams();
  const service = services.find((item) => slugify(item.title) === serviceSlug) || services[0];
  const related = services.filter((item) => item.title !== service.title).slice(0, 3);
  const details = serviceStrategyDetails[service.title];

  return (
    <>
      <PageHero eyebrow="Service Detail" title={service.title} text={`${service.summary} ${details.line}`} />
      <Section>
        <div className="space-y-8">
          <ServiceDetail service={service} />
          <ServiceExpandedContent service={service} />
        </div>
      </Section>
      <SingleServiceBusinessCase service={service} />
      <SingleServiceTrust service={service} />
      <Section className="bg-white dark:bg-navy-900/50" eyebrow="Next Services" title="Related capabilities">
        <div className="grid gap-5 md:grid-cols-3">
          {related.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={`/services/${slugify(item.title)}`} className="card p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <Icon className="text-cyan-500" size={28} />
                <h3 className="mt-4 font-heading text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.summary}</p>
              </Link>
            );
          })}
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}

function SingleServiceBusinessCase({ service }) {
  const details = serviceStrategyDetails[service.title];
  const points = [
    ["Strategic Fit", `We align ${service.title} with your business model, reporting needs, team structure and growth plan so the solution supports leadership decisions, not only daily tasks.`],
    ["Operational Control", "We reduce dependency on scattered files, manual reminders and unclear ownership by creating structured workflows, permissions and dashboards."],
    ["Scalable Execution", "The implementation is planned in phases so your company can start with critical modules, stabilize adoption and expand without creating chaos."],
    ["Decision Visibility", "We focus on the reports, alerts and KPIs that help owners, managers and department heads understand what is happening before issues become expensive."],
  ];

  return (
    <Section className="bg-slate-100 dark:bg-navy-900/40" eyebrow="Business Strategy" title={`${service.title} as a business growth system`} text={details.promise}>
      <div className="grid gap-5 md:grid-cols-2">
        {points.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.04} className="card p-7">
            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyanbrand-500/12 font-heading text-lg font-black text-cyan-600 dark:text-cyanbrand-300">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SingleServiceTrust({ service }) {
  const details = serviceStrategyDetails[service.title];
  return (
    <Section eyebrow="Client Confidence" title="Why clients can trust this delivery approach">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="dashboard-tile rounded-xl p-8 text-white shadow-enterprise">
          <p className="eyebrow text-cyanbrand-300">Trust Line</p>
          <h3 className="mt-4 font-heading text-3xl font-bold leading-tight">"{details.line}"</h3>
          <p className="mt-5 leading-8 text-slate-200">
            Amsun Technology Private Limited works like a long-term technology partner: clear discovery, practical implementation, security awareness, documentation and support after go-live.
          </p>
        </Reveal>
        <Reveal className="grid gap-4 sm:grid-cols-2">
          {[
            ["Clear scope", "Every engagement starts with deliverables, responsibilities, milestones and success criteria."],
            ["Secure access", "We follow least-privilege access, environment separation and controlled credential handling."],
            ["Real testing", "We validate workflows with UAT, migration checks, role reviews and practical launch planning."],
            ["Support mindset", "We train users, document important flows and help teams improve after launch."],
          ].map(([title, text]) => (
            <div key={title} className="card p-6">
              <CheckCircle2 className="text-cyan-500" size={24} />
              <h4 className="mt-4 font-heading text-lg font-bold">{title}</h4>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

function ServiceExpandedContent({ service }) {
  const details = serviceStrategyDetails[service.title];
  return (
    <Reveal className="rounded-xl border border-slate-200 bg-white p-7 shadow-enterprise dark:border-white/10 dark:bg-white/[0.055] sm:p-9">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="eyebrow">Detailed Capability</p>
          <h3 className="mt-3 font-heading text-2xl font-bold">{service.title} for serious business growth</h3>
          <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-200">{details.promise}</p>
          <blockquote className="mt-6 rounded-xl border-l-4 border-cyanbrand-500 bg-slate-50 p-5 text-lg font-semibold leading-8 text-slate-800 dark:bg-navy-950/50 dark:text-slate-100">
            "{details.line}"
          </blockquote>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <ServiceMiniList title="Key Features" items={service.features} />
          <ServiceMiniList title="Business Benefits" items={service.benefits} />
          <ServiceMiniList title="Delivery Process" items={service.process} />
          <ServiceMiniList title="Technologies Used" items={service.tech} />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {details.outcomes.map((item, i) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-navy-950/40">
            <p className="font-heading text-3xl font-black text-cyan-500">0{i + 1}</p>
            <p className="mt-3 font-bold leading-7 text-slate-700 dark:text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function ServiceMiniList({ title, items }) {
  return (
    <div>
      <h4 className="font-heading text-lg font-bold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-500" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceDetail({ service, flipped }) {
  const Icon = service.icon;
  return (
    <Reveal id={slugify(service.title)} className="card scroll-mt-28 overflow-hidden">
      <div className={cn("grid gap-0 lg:grid-cols-2", flipped && "lg:[&>*:first-child]:order-2")}>
        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyanbrand-500/12 text-cyan-600 dark:text-cyanbrand-300"><Icon size={25} /></span>
            <h2 className="font-heading text-2xl font-bold">{service.title}</h2>
          </div>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{service.summary}</p>
          <FeatureColumns service={service} />
        </div>
        <div className="dashboard-tile min-h-[360px] p-7">
          <MiniDashboard title={service.title} />
        </div>
      </div>
    </Reveal>
  );
}

function FeatureColumns({ service }) {
  const groups = [
    ["Features", service.features],
    ["Benefits", service.benefits],
    ["Process", service.process],
    ["Technologies", service.tech],
  ];
  return (
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      {groups.map(([label, values]) => (
        <div key={label}>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyanbrand-300">{label}</h3>
          <ul className="mt-3 space-y-2">
            {values.map((value) => <li key={value} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan-500" />{value}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MiniDashboard({ title }) {
  return (
    <div className="h-full rounded-xl border border-white/[0.14] bg-white/10 p-5 text-white backdrop-blur">
      <p className="text-sm font-bold text-cyanbrand-300">{title} cockpit</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {["Velocity", "Risk", "ROI", "Adoption"].map((metric, i) => (
          <div key={metric} className="rounded-lg bg-white/10 p-4">
            <p className="text-xs text-slate-300">{metric}</p>
            <p className="mt-2 text-2xl font-black">{[92, 18, 41, 87][i]}{i === 1 ? "%" : ""}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {[82, 64, 93].map((width, i) => <div key={width} className="h-3 rounded-full bg-white/10"><span className="block h-3 rounded-full bg-cyanbrand-400" style={{ width: `${width}%` }} /></div>)}
      </div>
    </div>
  );
}

function DemoCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const categories = ["All", ...new Set(demos.map((demo) => demo.category))];
  const filtered = demos.filter((demo) => {
    const matchesQuery = `${demo.title} ${demo.description} ${demo.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || demo.category === category);
  });

  return (
    <>
      <PageHero eyebrow="Demo Center" title="Explore ERP, CRM, AI and cybersecurity demos" text="Search realistic demo journeys, open video previews and request a live walkthrough tailored to your business workflow." />
      <Section className="pt-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input className="field pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demos by module, workflow or use case" />
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={cn("chip", category === item && "chip-active")}>{item}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((demo, i) => <DemoCard key={demo.id} demo={demo} delay={i * 0.03} onPlay={() => setSelected(demo)} />)}
        </div>
      </Section>
      <Section className="bg-white dark:bg-navy-900/50" eyebrow="Book Personalized Demo" title="Bring your actual workflow to the session">
        <DemoForm />
      </Section>
      {selected && <VideoModal demo={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function DemoCard({ demo, onPlay, delay }) {
  return (
    <Reveal delay={delay} className="card overflow-hidden">
      <div className="dashboard-tile h-44 p-4">
        <div className="rounded-xl border border-white/[0.12] bg-white/10 p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyanbrand-300">{demo.category}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[70, 86, 55, 92, 64, 78].map((value, i) => <span key={value + i} className="h-12 rounded-md bg-white/10" style={{ opacity: value / 100 }} />)}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold">{demo.title}</h3>
        <p className="mt-2 min-h-20 leading-7 text-slate-600 dark:text-slate-300">{demo.description}</p>
        <ul className="mt-4 space-y-2">
          {demo.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={15} className="text-cyan-500" />{feature}</li>)}
        </ul>
        <div className="mt-5 flex gap-2">
          <button className="primary-button flex-1 justify-center py-2.5" onClick={onPlay}><Play size={17} /> Watch</button>
          <Link to="/contact" className="secondary-button flex-1 justify-center py-2.5 text-slate-900 dark:text-white">Live Demo</Link>
        </div>
      </div>
    </Reveal>
  );
}

function VideoModal({ demo, onClose }) {
  const videoSources = getDemoVideoSources(demo.video);
  const videoRef = useRef(null);
  const [useFallback, setUseFallback] = useState(videoSources.streamUrls.length === 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seekVideo = (event) => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const openFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/80 p-4 backdrop-blur" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-navy-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10">
          <div><h3 className="font-heading text-xl font-bold">{demo.title}</h3><p className="text-sm text-slate-500 dark:text-slate-300">Embedded demo video</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Close video"><X size={20} /></button>
        </div>
        <div className="responsive-video-player">
          <div className="responsive-video-frame">
            {useFallback ? (
              <iframe src={videoSources.fallbackUrl} title={demo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <video
                ref={videoRef}
                playsInline
                preload="auto"
                onClick={togglePlayback}
                onError={() => setUseFallback(true)}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                {videoSources.streamUrls.map((sourceUrl) => <source key={sourceUrl} src={sourceUrl} type="video/mp4" />)}
              </video>
            )}
          </div>
          {!useFallback && (
            <div className="demo-video-controls">
              <button type="button" className="demo-video-control" onClick={togglePlayback} aria-label={isPlaying ? "Pause video" : "Play video"}>
                {isPlaying ? <Pause size={19} /> : <Play size={19} />}
              </button>
              <input
                className="demo-video-progress"
                type="range"
                min="0"
                max={duration || 0.1}
                step="0.1"
                value={Math.min(currentTime, duration || 0.1)}
                onChange={seekVideo}
                aria-label="Video progress"
              />
              <span className="demo-video-time">{formatVideoTime(currentTime)} / {formatVideoTime(duration)}</span>
              <button type="button" className="demo-video-control" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"}>
                {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
              <button type="button" className="demo-video-control" onClick={openFullscreen} aria-label="Open video fullscreen">
                <Maximize2 size={19} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="mx-auto grid max-w-4xl gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <input className="field" placeholder="Full name" aria-label="Full name" />
      <input className="field" placeholder="Business email" type="email" aria-label="Business email" />
      <input className="field" placeholder="Company" aria-label="Company" />
      <select className="field" aria-label="Demo interest" defaultValue="">
        <option value="" disabled>Demo interest</option>
        {demos.map((demo) => <option key={demo.id}>{demo.title}</option>)}
      </select>
      <textarea className="field sm:col-span-2" rows="4" placeholder="Tell us what you want to see in the live demo" aria-label="Demo notes" />
      {submitted && <p className="rounded-md bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300 sm:col-span-2">Demo request captured. We will contact you to schedule the walkthrough.</p>}
      <button className="primary-button justify-center sm:col-span-2" type="submit">Request Live Demo <CalendarCheck size={18} /></button>
    </form>
  );
}

function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Purpose-built digital operations for high-trust industries" text="We adapt ERP, AI, cloud and security patterns to your regulatory context, operational model and growth stage." />
      <Section><IndustryGrid /></Section>
      <ContactCTA />
    </>
  );
}

function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Amsun Technology Private Limited helps modern businesses operate securely at scale" text="Our mission is to make enterprise systems more intelligent, connected and resilient for global clients." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="card p-8"><h2 className="heading-md">Mission</h2><p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">Deliver secure, practical and measurable digital transformation through ERP, AI, cloud and cybersecurity services.</p></Reveal>
          <Reveal className="card p-8"><h2 className="heading-md">Vision</h2><p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">Become a trusted global technology partner for companies that need automation, reliability and cyber resilience.</p></Reveal>
        </div>
      </Section>
      <Section className="bg-white dark:bg-navy-900/50" eyebrow="Founder Message" title="Technology should simplify growth, not create new complexity">
        <Reveal className="mx-auto max-w-4xl text-center text-xl leading-9 text-slate-700 dark:text-slate-200">
          "We built Amsun around a simple belief: enterprise technology must be secure, usable and tied to business outcomes. Our teams combine consulting clarity with hands-on engineering so clients can move with confidence."
        </Reveal>
      </Section>
      <Section eyebrow="Global Delivery Model" title="Structured delivery for distributed teams">
        <div className="grid gap-5 md:grid-cols-3">
          {["Discovery and governance", "Agile implementation", "Managed optimization"].map((item, i) => <Reveal key={item} className="card p-7"><p className="text-4xl font-black text-cyan-500">0{i + 1}</p><h3 className="mt-4 font-heading text-xl font-bold">{item}</h3></Reveal>)}
        </div>
      </Section>
      <Stats />
    </>
  );
}

function Stats() {
  const stats = [["Projects Delivered", 120, "+"], ["Support Hours", 18000, "+"], ["Client Satisfaction", 98, "%"], ["Security Monitoring", 24, "/7"]];
  return (
    <Section className="bg-navy-950 text-white" eyebrow="Why Clients Trust Us" title="Operational proof points">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, suffix]) => <Counter key={label} label={label} value={value} suffix={suffix} />)}
      </div>
    </Section>
  );
}

function Counter({ label, value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let frame;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / 1100, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.08] p-7 text-center">
      <p className="font-heading text-4xl font-black text-cyanbrand-300">{count.toLocaleString()}{suffix}</p>
      <p className="mt-2 text-sm font-bold text-slate-300">{label}</p>
    </div>
  );
}

function Careers() {
  const roles = ["Odoo Functional Consultant", "Cloud DevOps Engineer", "Cybersecurity Analyst", "AI Automation Engineer", "Business Development Executive"];
  return (
    <>
      <PageHero eyebrow="Careers" title="Build secure, intelligent business systems with us" text="Join a delivery culture that values ownership, learning, clear communication and customer impact." />
      <Section eyebrow="Culture" title="A focused environment for builders and consultants">
        <div className="grid gap-5 md:grid-cols-3">
          {["Ownership", "Learning", "Client clarity"].map((item) => <Reveal key={item} className="card p-7"><h3 className="font-heading text-xl font-bold">{item}</h3><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">We keep teams small, decisions visible and growth tied to real delivery outcomes.</p></Reveal>)}
        </div>
      </Section>
      <Section className="bg-white dark:bg-navy-900/50" eyebrow="Open Roles" title="Current opportunities">
        <div className="mx-auto max-w-4xl space-y-3">
          {roles.map((role) => <Reveal key={role} className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center"><div><h3 className="font-heading text-lg font-bold">{role}</h3><p className="text-sm text-slate-500 dark:text-slate-300">Remote-friendly | Full-time | Enterprise delivery</p></div><Link to="/contact" className="secondary-button justify-center text-slate-900 dark:text-white">Apply</Link></Reveal>)}
        </div>
      </Section>
      <Section eyebrow="Hiring Process" title="Transparent from first call to offer">
        <div className="grid gap-5 md:grid-cols-4">
          {["Intro call", "Skill discussion", "Practical task", "Final alignment"].map((step, i) => <Reveal key={step} className="card p-6"><p className="text-3xl font-black text-cyan-500">{i + 1}</p><h3 className="mt-4 font-heading text-lg font-bold">{step}</h3></Reveal>)}
        </div>
      </Section>
      <Section className="bg-slate-100 dark:bg-navy-900/40" eyebrow="Benefits" title="Support for sustainable work">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Remote flexibility", "Certification support", "Mentorship", "Performance bonuses"].map((benefit) => <Reveal key={benefit} className="card p-5 text-center font-bold">{benefit}</Reveal>)}
        </div>
      </Section>
    </>
  );
}

function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s plan your ERP, AI, cloud or security roadmap" text="Tell us what you want to improve. We will respond with the right next step, from a consultation to a live demo or security audit." />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal><ContactForm /></Reveal>
          <Reveal className="space-y-5">
            <div className="card p-6">
              <h2 className="heading-md">Business Contact</h2>
              <p className="mt-4 flex gap-3 text-slate-600 dark:text-slate-300"><Mail className="text-cyan-500" /> contact@amsuntechnology.com</p>
              <p className="mt-3 flex gap-3 text-slate-600 dark:text-slate-300"><MessageCircle className="text-cyan-500" /> WhatsApp consultation available</p>
              <p className="mt-3 flex gap-3 text-slate-600 dark:text-slate-300"><CalendarCheck className="text-cyan-500" /> Calendly integration placeholder</p>
            </div>
            <div className="map-placeholder"><MapPin size={34} /><span>Google Maps Embed Placeholder</span></div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="card grid gap-4 p-6 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <input className="field" placeholder="Full name" aria-label="Full name" />
      <input className="field" placeholder="Business email" type="email" aria-label="Business email" />
      <input className="field" placeholder="Company" aria-label="Company" />
      <select className="field" aria-label="Service interest" defaultValue="">
        <option value="" disabled>Service interest</option>
        {services.map((service) => <option key={service.title}>{service.title}</option>)}
      </select>
      <textarea className="field sm:col-span-2" rows="6" placeholder="Project goals, timeline or security concerns" aria-label="Message" />
      {submitted && <p className="rounded-md bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300 sm:col-span-2">Thanks. Your consultation request is ready for follow-up.</p>}
      <button className="primary-button justify-center sm:col-span-2" type="submit">Send Message <ArrowRight size={18} /></button>
    </form>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <section className="relative overflow-hidden bg-mesh-dark py-20 text-white sm:py-24">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <Reveal className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-cyanbrand-300">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-200">{text}</p>
      </Reveal>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="bg-navy-950 py-16 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div><p className="eyebrow text-cyanbrand-300">Ready to generate results?</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Book a free consultation or request a tailored ERP demo.</h2></div>
        <div className="flex flex-col gap-3 sm:flex-row"><Link to="/contact" className="primary-button justify-center">Book Consultation</Link><Link to="/demo-center" className="secondary-button justify-center">View Demo Center</Link></div>
      </div>
    </section>
  );
}

function FloatingContact() {
  return (
    <Link to="/contact" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-cyanbrand-500 text-navy-950 shadow-glow transition hover:-translate-y-1" aria-label="Contact Amsun Technology">
      <MessageCircle size={24} />
    </Link>
  );
}

function Footer() {
  const [joined, setJoined] = useState(false);
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-heading text-2xl font-bold">Amsun Technology</h2>
          <p className="mt-3 leading-7 text-slate-300">Secure AI-Powered ERP, Cloud & Cybersecurity Solutions for global businesses.</p>
        </div>
        <FooterList title="Quick Links" items={navItems.map(([label, href]) => ({ label, href }))} />
        <FooterList title="Services" items={services.map((service) => ({ label: service.title, href: `/services/${slugify(service.title)}` }))} />
        <div>
          <h3 className="font-heading text-lg font-bold">Newsletter</h3>
          <p className="mt-3 text-sm text-slate-300">Monthly insights on ERP, AI and security.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setJoined(true);
            }}
          >
            <input className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.08] px-3 py-2 text-sm outline-none focus:border-cyanbrand-400" placeholder="Email" aria-label="Newsletter email" />
            <button className="rounded-md bg-cyanbrand-500 px-4 py-2 font-bold text-navy-950">Join</button>
          </form>
          {joined && <p className="mt-3 text-sm font-bold text-cyanbrand-300">You are on the newsletter list.</p>}
          <div className="mt-5 flex gap-3 text-sm text-slate-300"><a href="https://linkedin.com" className="hover:text-cyanbrand-300">LinkedIn</a><a href="https://x.com" className="hover:text-cyanbrand-300">X</a></div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">© 2026 Amsun Technology Private Limited. All rights reserved.</div>
    </footer>
  );
}

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-bold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => <li key={`${title}-${item.label}`}><Link to={item.href} className="text-sm text-slate-300 hover:text-cyanbrand-300">{item.label}</Link></li>)}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
