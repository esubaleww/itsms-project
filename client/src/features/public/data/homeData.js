import {
  Lightbulb,
  Users,
  Briefcase,
  Server,
  Code,
  Cloud,
  Shield,
  Zap,
  Award,
  Clock,
} from "lucide-react";

export const programs = [
  {
    icon: Lightbulb,
    title: "Innovation Program",
    description:
      "Transform your innovative ideas into reality with mentorship, funding, and incubation support.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    link: "/applications/apply/innovation",
    features: ["Mentorship", "Funding Support", "Incubation Space"],
  },
  {
    icon: Users,
    title: "Internship Program",
    description:
      "Gain hands-on experience and develop professional skills through our comprehensive internship program.",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    link: "/applications/apply/internship",
    features: ["Hands-on Experience", "Professional Training", "Certification"],
  },
  {
    icon: Briefcase,
    title: "Startup Program",
    description:
      "Register your startup and get access to resources, mentorship, and funding opportunities.",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    link: "/applications/apply/startup",
    features: ["Business Support", "Networking", "Investment Access"],
  },
];

export const services = [
  {
    icon: Server,
    title: "Data Center Management",
    description:
      "Professional data center monitoring, maintenance, and optimization services.",
    price: "Negotiable",
  },
  {
    icon: Code,
    title: "Digital Literacy Training",
    description:
      "Basic digital skills training for community members and organizations.",
    price: "Free",
    popular: true,
  },
  {
    icon: Cloud,
    title: "E-Government Solutions",
    description:
      "Digitize government service delivery with integrated systems.",
    price: "Negotiable",
  },
  {
    icon: Shield,
    title: "IT Consulting & Strategy",
    description:
      "Expert IT consulting for digital transformation and technology strategy.",
    price: "Free",
  },
];

export const features = [
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Quick turnaround on applications and requests",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data is protected with enterprise security",
  },
  {
    icon: Award,
    title: "Expert Support",
    description: "Guidance from experienced professionals",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access services anytime, anywhere",
  },
];
