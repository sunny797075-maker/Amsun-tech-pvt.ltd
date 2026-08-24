import {
  BarChart3,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Factory,
  HeartPulse,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

export const navItems = [
  ["Home", "/"],
  ["Services", "/services"],
  ["ERP & CRM Demo", "/demo-center"],
  ["Industries", "/industries"],
  ["About Us", "/about"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
];

export const services = [
  {
    title: "Odoo ERP Solutions",
    icon: Database,
    summary: "End-to-end Odoo implementation, customization, integration, migration and support.",
    features: ["Finance, inventory, HRMS and POS modules", "Multi-company workflows", "API integrations", "Role-based dashboards"],
    benefits: ["Lower operational friction", "Real-time process visibility", "Faster month-end close"],
    process: ["Discovery", "Solution blueprint", "Agile configuration", "Go-live support"],
    tech: ["Odoo", "PostgreSQL", "Python", "REST APIs"],
  },
  {
    title: "AI Automation",
    icon: Sparkles,
    summary: "Intelligent workflows for documents, sales, customer service and operations.",
    features: ["AI assistants", "Document intelligence", "Workflow orchestration", "Predictive alerts"],
    benefits: ["Reduced manual effort", "Better decision speed", "Consistent execution"],
    process: ["Use-case audit", "Prototype", "Human-in-loop controls", "Production rollout"],
    tech: ["OpenAI", "Vector databases", "LangChain", "Node.js"],
  },
  {
    title: "Cybersecurity Services",
    icon: ShieldCheck,
    summary: "Security assessments, managed monitoring, endpoint protection and compliance readiness.",
    features: ["VAPT", "SOC monitoring", "Cloud security posture", "Incident response"],
    benefits: ["Lower business risk", "Clear remediation roadmap", "Audit-ready controls"],
    process: ["Assessment", "Prioritization", "Hardening", "Continuous monitoring"],
    tech: ["CrowdStrike", "SIEM", "WAF", "Zero Trust"],
  },
  {
    title: "Cloud & DevOps",
    icon: CloudCog,
    summary: "Cloud architecture, migration, automation, CI/CD and infrastructure reliability.",
    features: ["AWS and Azure architecture", "Kubernetes platforms", "CI/CD pipelines", "Observability"],
    benefits: ["Elastic scale", "Lower release risk", "Improved uptime"],
    process: ["Cloud readiness", "Landing zone", "Pipeline automation", "SRE handover"],
    tech: ["AWS", "Azure", "Docker", "Kubernetes"],
  },
  {
    title: "CRM Solutions",
    icon: Users,
    summary: "Sales pipeline, customer service and marketing automation tuned for revenue teams.",
    features: ["Lead scoring", "Sales automation", "Customer 360", "Campaign journeys"],
    benefits: ["Better conversion", "Cleaner customer data", "Forecast confidence"],
    process: ["Sales mapping", "CRM configuration", "Data migration", "Adoption enablement"],
    tech: ["Odoo CRM", "HubSpot", "Zapier", "Analytics"],
  },
  {
    title: "Data Analytics",
    icon: BarChart3,
    summary: "Executive dashboards, data pipelines and KPI analytics for operational clarity.",
    features: ["BI dashboards", "Data warehouse", "KPI modeling", "Automated reports"],
    benefits: ["Single source of truth", "Faster reporting", "Actionable insights"],
    process: ["Metric design", "Data modeling", "Dashboard build", "Governance"],
    tech: ["Power BI", "BigQuery", "dbt", "Python"],
  },
  {
    title: "Website & Application Development",
    icon: Code2,
    summary: "High-performance corporate websites and secure web applications designed to convert, integrate and scale.",
    features: ["Responsive websites and client portals", "Custom web applications", "API and ERP/CRM integrations", "Performance, accessibility and SEO"],
    benefits: ["Stronger digital trust", "Better customer journeys", "A scalable product foundation"],
    process: ["Discovery workshop", "UX and solution design", "Agile development", "Launch and optimization"],
    tech: ["React", "Node.js", "Vite", "REST APIs"],
  },
];

export const demos = [
  ["Odoo ERP Demo", "ERP", "Unified procurement, finance, inventory and approvals workspace.", ["Multi-company", "Workflow approvals", "Finance cockpit"]],
  ["CRM Demo", "CRM", "Pipeline, lead scoring, account health and revenue forecasting.", ["Deal board", "Customer 360", "AI follow-ups"]],
  ["Inventory Management", "Operations", "Warehouse movement, reorder rules, barcode flows and stock valuation.", ["Barcode ops", "Reorder alerts", "Lot tracking"]],
  ["HRMS", "People", "Recruitment, attendance, payroll inputs, appraisals and employee self-service.", ["Leave workflows", "Attendance", "Performance"]],
  ["POS System", "Retail", "Fast omnichannel POS with inventory sync and customer loyalty.", ["Offline mode", "Loyalty", "Store analytics"]],
  ["Accounting", "Finance", "Invoice automation, bank reconciliation, tax readiness and reporting.", ["Reconciliation", "Tax rules", "Cash flow"]],
  ["AI Automation Demo", "AI", "AI assistants for support, documents, sales ops and approvals.", ["RAG assistant", "Document AI", "Workflow triggers"]],
  ["Cybersecurity Dashboard Demo", "Security", "Security posture, threats, assets, incidents and compliance signals.", ["Threat feed", "Risk score", "SOC queue"]],
].map(([title, category, description, features], index) => ({
  id: title.toLowerCase().replaceAll(" ", "-"),
  title,
  category,
  description,
  features,
  video:
    title === "Odoo ERP Demo"
      ? "https://drive.google.com/file/d/1AWULuRHl7wPUBXgXTGonk5re63u8-Xyy/preview"
      : "https://www.youtube.com/embed/ysz5S6PUM-U",
  accent: ["cyan", "blue", "teal", "indigo"][index % 4],
}));

export const industries = [
  ["Healthcare", HeartPulse, "HIPAA-aware workflows, patient operations, secure records and analytics."],
  ["Retail", ShoppingBag, "POS, inventory, CRM loyalty and omnichannel operations."],
  ["Manufacturing", Factory, "MRP, shop-floor visibility, procurement and quality control."],
  ["Logistics", Truck, "Fleet, warehouse, dispatch, track-and-trace and billing automation."],
  ["E-commerce", ShoppingBag, "Order orchestration, returns, customer service and marketplace integrations."],
  ["SaaS", Cpu, "Cloud reliability, security hardening, subscriptions and customer success analytics."],
];

export const technologies = ["Odoo", "AWS", "Azure", "OpenAI", "Docker", "Kubernetes", "CrowdStrike"];

export const caseStudies = [
  ["Global distributor", "42% faster order cycle after Odoo inventory and CRM rollout."],
  ["Healthcare network", "24/7 security monitoring with prioritized incident response playbooks."],
  ["SaaS platform", "Zero-downtime cloud migration with containerized CI/CD pipelines."],
];

export const testimonials = [
  ["Operations Director, UK Retail Group", "Amsun brought structure, speed and security discipline to our ERP transformation."],
  ["Founder, US SaaS Company", "Their AI automation pilots moved from idea to production without disrupting our teams."],
  ["CFO, Manufacturing Enterprise", "The dashboards finally gave us one trusted view of inventory and cash flow."],
];

export const faqs = [
  ["Do you work with US and UK clients?", "Yes. Amsun supports global delivery with remote-first governance, timezone overlap and clear weekly reporting."],
  ["Can you customize Odoo for our process?", "Yes. We configure standard modules first, then extend only where custom workflows create measurable value."],
  ["Do you provide cybersecurity audits?", "Yes. We offer security posture reviews, VAPT coordination, cloud hardening and managed monitoring packages."],
  ["Can we start with a small AI pilot?", "Yes. We typically begin with a focused use case, measurable success criteria and production controls."],
];
