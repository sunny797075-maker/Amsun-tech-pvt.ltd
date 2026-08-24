import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 5173);

const tailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        navy: { 950: "#06111f", 900: "#071a33", 800: "#0b2547", 700: "#123966" },
        cyanbrand: { 500: "#09d3f2", 400: "#39e4ff", 300: "#8cf3ff" },
        steel: "#111827",
      },
      boxShadow: {
        glow: "0 24px 70px rgba(9, 211, 242, 0.22)",
        enterprise: "0 20px 60px rgba(2, 10, 24, 0.14)",
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 10% 20%, rgba(9,211,242,.22), transparent 32%), radial-gradient(circle at 85% 12%, rgba(37,99,235,.22), transparent 28%), linear-gradient(135deg, #06111f 0%, #071a33 50%, #0b2547 100%)",
      },
    },
  },
};

const componentCss = `
.hero-office-bg{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 78% 18%,rgba(9,211,242,.2),transparent 30%),linear-gradient(180deg,#dff8ff 0%,#bfeeff 34%,#eef8ff 62%,#fff 100%)}.hero-real-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.92}
:root{color-scheme:light;scroll-behavior:smooth}.dark{color-scheme:dark}body{margin:0;min-width:320px}.section{padding-top:4rem;padding-bottom:4rem}@media(min-width:640px){.section{padding-top:5rem;padding-bottom:5rem}}.eyebrow{font-size:.875rem;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:#0891b2}.dark .eyebrow{color:#8cf3ff}.heading-lg{font-family:Poppins,Inter,sans-serif;font-size:1.875rem;line-height:1.15;font-weight:800;color:#020617}.dark .heading-lg{color:#fff}@media(min-width:640px){.heading-lg{font-size:2.25rem}}.heading-md{font-family:Poppins,Inter,sans-serif;font-size:1.5rem;line-height:1.2;font-weight:700;color:#020617}.dark .heading-md{color:#fff}.card{border-radius:.75rem;border:1px solid #e2e8f0;background:#fff;box-shadow:0 20px 60px rgba(2,10,24,.14)}.dark .card{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.055)}.primary-button{display:inline-flex;align-items:center;gap:.5rem;border-radius:.375rem;background:#09d3f2;padding:.75rem 1.25rem;font-size:.875rem;font-weight:800;color:#06111f;box-shadow:0 24px 70px rgba(9,211,242,.22);transition:.2s}.primary-button:hover{transform:translateY(-2px);background:#8cf3ff}.secondary-button{display:inline-flex;align-items:center;gap:.5rem;border-radius:.375rem;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);padding:.75rem 1.25rem;font-size:.875rem;font-weight:800;color:#fff;backdrop-filter:blur(12px);transition:.2s}.secondary-button:hover{transform:translateY(-2px);background:rgba(255,255,255,.16)}.icon-button{display:grid;height:2.5rem;width:2.5rem;place-items:center;border-radius:.375rem;border:1px solid #e2e8f0;background:#fff;color:#1e293b;transition:.2s}.icon-button:hover{background:#f1f5f9}.dark .icon-button{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.08);color:#fff}.dark .icon-button:hover{background:rgba(255,255,255,.14)}.field{width:100%;border-radius:.375rem;border:1px solid #e2e8f0;background:#fff;padding:.75rem 1rem;font-size:.875rem;color:#0f172a;outline:none;transition:.2s}.field:focus{border-color:#06b6d4;box-shadow:0 0 0 4px rgba(6,182,212,.1)}.field::placeholder{color:#94a3b8}.dark .field{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.08);color:#fff}.chip{border-radius:.375rem;border:1px solid #e2e8f0;background:#fff;padding:.5rem 1rem;font-size:.875rem;font-weight:700;color:#334155;transition:.2s}.chip:hover{border-color:#22d3ee;color:#0e7490}.dark .chip{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.08);color:#e2e8f0}.chip-active{border-color:#09d3f2;background:#09d3f2;color:#06111f}.chip-active:hover{color:#06111f}.tech-logo{display:flex;min-height:7rem;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;border-radius:.5rem;border:1px solid #e2e8f0;background:#fff;padding:1rem;text-align:center;font-family:Poppins,Inter,sans-serif;font-weight:700;box-shadow:0 20px 60px rgba(2,10,24,.14)}.dark .tech-logo{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.055)}.grid-pattern{background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:42px 42px}.glass-panel{background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.06));box-shadow:0 30px 90px rgba(0,0,0,.35);backdrop-filter:blur(18px)}.floating-card{position:absolute;z-index:2;display:none;align-items:center;gap:.5rem;border:1px solid rgba(255,255,255,.14);border-radius:.75rem;background:rgba(255,255,255,.12);padding:.75rem 1rem;color:white;font-size:.875rem;font-weight:800;backdrop-filter:blur(16px);box-shadow:0 20px 55px rgba(0,0,0,.24)}@media(min-width:640px){.floating-card{display:flex}}.dot{width:.625rem;height:.625rem;border-radius:999px}.dashboard-tile{background:radial-gradient(circle at 12% 18%,rgba(9,211,242,.28),transparent 34%),radial-gradient(circle at 88% 30%,rgba(59,130,246,.24),transparent 30%),linear-gradient(135deg,#06111f,#0b2547)}.map-placeholder{display:grid;min-height:300px;place-items:center;gap:.75rem;border:1px solid rgba(148,163,184,.28);border-radius:.75rem;background:linear-gradient(90deg,rgba(148,163,184,.16) 1px,transparent 1px),linear-gradient(rgba(148,163,184,.16) 1px,transparent 1px),linear-gradient(135deg,rgba(9,211,242,.12),rgba(15,23,42,.08));background-size:28px 28px,28px 28px,auto;color:#475569;font-weight:800;text-align:center}.dark .map-placeholder{color:#cbd5e1;background:linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(135deg,rgba(9,211,242,.14),rgba(255,255,255,.04));background-size:28px 28px,28px 28px,auto}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}
`;

function stripImports(source) {
  return source
    .replace(/import React[\s\S]*?from "react";\n/, "")
    .replace(/import \{[\s\S]*?\} from "react-dom\/client";\n/, "")
    .replace(/import \{[\s\S]*?\} from "react-router-dom";\n/, "")
    .replace(/import \{[\s\S]*?\} from "framer-motion";\n/, "")
    .replace(/import \{[\s\S]*?\} from "lucide-react";\n/, "")
    .replace(/import \{ GOOGLE_DRIVE_VIDEO_URL \} from "\.\/config\/video\.js";\n/, "")
    .replace(/import \{[\s\S]*?\} from "\.\/data\/siteData\.jsx";\n/, "")
    .replace(/import "\.\/styles\.css";\n/, "");
}

function stripDataExports(source) {
  return source
    .replace(/import \{[\s\S]*?\} from "lucide-react";\n/, "")
    .replaceAll("export const ", "const ");
}

async function buildAppCode() {
  const [main, data, videoConfig] = await Promise.all([
    fs.readFile(path.join(root, "src/main.jsx"), "utf8"),
    fs.readFile(path.join(root, "src/data/siteData.jsx"), "utf8"),
    fs.readFile(path.join(root, "src/config/video.js"), "utf8"),
  ]);
  const header = `
import React, { useEffect, useState } from "https://esm.sh/react@19.1.1";
import { createRoot } from "https://esm.sh/react-dom@19.1.1/client";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from "https://esm.sh/react-router-dom@7.9.5";
import { AnimatePresence, motion, useInView, useReducedMotion } from "https://esm.sh/framer-motion@12.23.24";
import {
  ArrowRight, BarChart3, CalendarCheck, CheckCircle2, ChevronDown, CloudCog, Cpu, Database, Factory,
  HeartPulse, LineChart, LockKeyhole, Mail, MapPin, Menu, MessageCircle, Moon, Network, Play, Search,
  ShieldCheck, ShoppingBag, Sparkles, Sun, Truck, Users, X, Zap
} from "https://esm.sh/lucide-react@0.468.0";
`;
  return header + "\n" + videoConfig.replaceAll("export const ", "const ") + "\n" + stripDataExports(data) + "\n" + stripImports(main);
}

async function html() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Amsun Technology Private Limited | Local Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = ${JSON.stringify(tailwindConfig)}</script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>${componentCss}</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react" data-type="module">
${await buildAppCode()}
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    if (url.pathname.startsWith("/public/")) {
      const file = path.join(root, url.pathname);
      const body = await fs.readFile(file);
      res.writeHead(200);
      res.end(body);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await html());
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error.stack || error));
  }
});

server.listen(port, () => {
  console.log(`Amsun preview running at http://localhost:${port}/`);
});
