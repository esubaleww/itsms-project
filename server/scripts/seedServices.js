// server/scripts/seedServices.js
import connectDb from "../config/db.js";
import ServiceCatalog from "../models/ServiceCatalog.js";

const services = [
  // ==================== INFRASTRUCTURE SERVICES ====================
  {
    name: "Network Setup & Configuration",
    category: "infrastructure",
    icon: "Wifi",
    description:
      "Configure and set up network infrastructure including routers, switches, and firewalls.",
    estimatedTime: "3-5 days",
    popular: true,
    requirements: ["Network diagram", "IP address range", "VLAN requirements"],
    documents: ["Network topology diagram"],
    legalReference: "Art.6(7)",
  },
  {
    name: "Data Center Management",
    category: "infrastructure",
    icon: "Database",
    description:
      "Data center monitoring, maintenance, and optimization services.",
    estimatedTime: "Ongoing",
    popular: true,
    requirements: ["Access to data center", "Monitoring credentials"],
    legalReference: "Art.6(7)",
  },
  {
    name: "Server Configuration & Maintenance",
    category: "infrastructure",
    icon: "Server",
    description:
      "Set up and configure servers including OS installation, security hardening, and application setup.",
    estimatedTime: "2-3 days",
    popular: false,
    requirements: ["Server hardware", "OS license", "Application requirements"],
    legalReference: "Art.6(7)",
  },
  {
    name: "Cloud Migration Services",
    category: "infrastructure",
    icon: "Cloud",
    description:
      "Migrate on-premise services to cloud platforms (AWS, Azure, GCP).",
    estimatedTime: "1-2 weeks",
    popular: false,
    requirements: [
      "Current infrastructure inventory",
      "Cloud provider preference",
    ],
    legalReference: "Art.6(7)",
  },

  // ==================== DEVELOPMENT SERVICES ====================
  {
    name: "Website Development",
    category: "development",
    icon: "Globe",
    description:
      "Custom website development with responsive design and modern frameworks.",
    estimatedTime: "2-4 weeks",
    popular: true,
    requirements: ["Design mockups", "Content", "Domain name"],
    documents: ["Website requirements document", "Design files"],
    legalReference: "Art.6(5)",
  },
  {
    name: "Portal & Dashboard Development",
    category: "development",
    icon: "Code",
    description:
      "Custom portal and dashboard development with user management and analytics.",
    estimatedTime: "3-6 weeks",
    popular: false,
    requirements: ["User requirements", "Data sources", "API documentation"],
    legalReference: "Art.6(6)",
  },
  {
    name: "E-Government Solutions",
    category: "development",
    icon: "Briefcase",
    description:
      "Digitize government service delivery with integrated systems.",
    estimatedTime: "4-8 weeks",
    popular: true,
    requirements: [
      "Service workflow",
      "User requirements",
      "Integration needs",
    ],
    legalReference: "Art.6(5)",
  },
  {
    name: "Mobile Application Development",
    category: "development",
    icon: "Smartphone",
    description: "Develop mobile apps for Android and iOS platforms.",
    estimatedTime: "3-8 weeks",
    popular: false,
    requirements: [
      "App requirements",
      "UI/UX design",
      "Platform specifications",
    ],
    legalReference: "Art.6(5)",
  },

  // ==================== SECURITY SERVICES ====================
  {
    name: "Security Audit & Assessment",
    category: "security",
    icon: "Shield",
    description:
      "Comprehensive security assessment including vulnerability scanning and penetration testing.",
    estimatedTime: "1 week",
    popular: true,
    requirements: [
      "System access",
      "Network diagram",
      "Previous audit reports",
    ],
    legalReference: "Art.6(8)",
  },
  {
    name: "Cybersecurity Training",
    category: "security",
    icon: "Lock",
    description:
      "Security awareness training for staff covering phishing, password security, and data protection.",
    estimatedTime: "2 days",
    popular: false,
    requirements: ["Number of participants", "Preferred date"],
    legalReference: "Art.6(8)",
  },
  {
    name: "Data Protection & Privacy Compliance",
    category: "security",
    icon: "ShieldCheck",
    description:
      "Ensure compliance with data protection regulations and privacy standards.",
    estimatedTime: "2-3 weeks",
    popular: false,
    requirements: [
      "Data inventory",
      "Current policies",
      "Compliance checklist",
    ],
    legalReference: "Art.6(8)",
  },

  // ==================== CONSULTING SERVICES ====================
  {
    name: "IT Consulting & Strategy",
    category: "consulting",
    icon: "Briefcase",
    description:
      "Expert IT consulting services for digital transformation and technology strategy.",
    estimatedTime: "1-2 weeks",
    popular: true,
    requirements: [
      "Organization goals",
      "Current IT infrastructure",
      "Budget constraints",
    ],
    legalReference: "Art.6(14)",
  },
  {
    name: "Technology Assessment",
    category: "consulting",
    icon: "Search",
    description:
      "Evaluate and recommend appropriate technologies for your organization.",
    estimatedTime: "1-2 weeks",
    popular: false,
    requirements: ["Technology needs", "Current solutions", "Budget"],
    legalReference: "Art.6(13), 6(16)",
  },
  {
    name: "Technology Transfer Support",
    category: "consulting",
    icon: "RefreshCw",
    description:
      "Facilitate technology adoption and adaptation for local context.",
    estimatedTime: "2-4 weeks",
    popular: false,
    requirements: [
      "Technology specification",
      "Local conditions",
      "Training needs",
    ],
    legalReference: "Art.6(16-18)",
  },

  // ==================== TRAINING SERVICES ====================
  {
    name: "Digital Literacy Training",
    category: "training",
    icon: "Users",
    description: "Basic digital skills training for community members.",
    estimatedTime: "2-3 days",
    popular: true,
    requirements: [
      "Number of participants",
      "Language preference",
      "Skill level",
    ],
    legalReference: "Art.6(4)",
  },
  {
    name: "Software Development Training",
    category: "training",
    icon: "Code",
    description:
      "Training programs for software development best practices and modern frameworks.",
    estimatedTime: "1 week",
    popular: false,
    requirements: ["Current skill level", "Framework preference", "Duration"],
    legalReference: "Art.6(4)",
  },
  {
    name: "IT Professional Certification",
    category: "training",
    icon: "Award",
    description: "Preparation and training for IT professional certifications.",
    estimatedTime: "2-4 weeks",
    popular: false,
    requirements: [
      "Certification target",
      "Current knowledge",
      "Available time",
    ],
    legalReference: "Art.6(23)",
  },

  // ==================== RESEARCH SERVICES ====================
  {
    name: "Research Grant Application Support",
    category: "research",
    icon: "FileText",
    description:
      "Support for preparing and submitting research grant applications.",
    estimatedTime: "2-3 weeks",
    popular: false,
    requirements: ["Research proposal", "Budget plan", "Team qualifications"],
    legalReference: "Art.6(20-21)",
  },
  {
    name: "Research Impact Assessment",
    category: "research",
    icon: "BarChart",
    description: "Evaluate research outcomes and impact on development.",
    estimatedTime: "2-4 weeks",
    popular: false,
    requirements: ["Research data", "Methodology", "Baseline metrics"],
    legalReference: "Art.6(20)",
  },

  // ==================== INDIGENOUS KNOWLEDGE SERVICES ====================
  {
    name: "Indigenous Knowledge Documentation",
    category: "consulting",
    icon: "BookOpen",
    description: "Document and preserve indigenous knowledge and practices.",
    estimatedTime: "3-6 weeks",
    popular: false,
    requirements: [
      "Community consent",
      "Knowledge holders",
      "Documentation format",
    ],
    legalReference: "Art.6(10)",
  },
  {
    name: "Traditional Knowledge Protection",
    category: "consulting",
    icon: "Shield",
    description:
      "Support for protecting and commercializing traditional knowledge.",
    estimatedTime: "2-4 weeks",
    popular: false,
    requirements: [
      "Intellectual property assessment",
      "Market potential",
      "Community agreement",
    ],
    legalReference: "Art.6(10)",
  },
];

async function seedServices() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDb();

    console.log("🗑️ Clearing existing services...");
    await ServiceCatalog.deleteMany({});

    console.log("📥 Inserting services...");
    const inserted = await ServiceCatalog.insertMany(services);

    console.log("\n✅ Seeding completed!");
    console.log(`📊 Inserted ${inserted.length} services:`);

    // Group by category for summary
    const byCategory = inserted.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📈 Summary by category:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   • ${cat}: ${count} services`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedServices();
