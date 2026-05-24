import {
  Outlet,
  Link,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Newspaper,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";

const itsmsLogo =
  "https://res.cloudinary.com/dlqn1qugq/image/upload/q_auto/f_auto/v1776159724/itsms-logo_w1jyzl.jpg";

const PublicLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const scrollToFooter = (e) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    if (footerRef.current) {
      footerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const footerLinks = {
    quickLinks: [
      { to: "/services/browse", label: "Services" },
      { to: "applications/apply/internship", label: "Internship Program" },
      { to: "applications/apply/startup", label: "Startup Program" },
      { to: "/news", label: "News & Updates" },
    ],
    support: [
      { to: "/faq", label: "FAQ" },
      { to: "/help", label: "Help Center" },
      { to: "/terms", label: "Terms of Use" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
    contact: {
      address: "Bahir Dar, Ethiopia",
      email: "info@itsms.gov.et",
      phone: "+251-582-123456",
    },
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 bg-white border-b border-gray-200 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link
              to="/"
              className="flex items-center gap-1.5 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-full overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={itsmsLogo}
                    alt="ITSMS - Amhara Innovation and Technology Bureau"
                    className="size-9 brightness-95 contrast-95 group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </div>
              <span className="hidden sm:inline-block text-sm font-heading font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                ITSMS
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              <NavLink
                to="/services/browse"
                className={({ isActive }) =>
                  `text-sm font-heading font-normal transition-all duration-200 ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-accent"
                  }`
                }
              >
                Services
              </NavLink>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `text-sm font-heading font-normal transition-all duration-200 ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-accent"
                  }`
                }
              >
                News
              </NavLink>
              <button
                onClick={scrollToFooter}
                className="text-sm font-heading font-normal transition-all duration-200 text-text-secondary hover:text-accent"
              >
                Contact
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-text-primary hidden lg:inline">
                      {user?.fullName?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-gray-200 bg-gray-50">
                          <p className="text-text-primary font-medium text-sm">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </Link>
                          <div className="border-t border-gray-200 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-text-secondary hover:text-accent transition text-sm font-heading font-normal"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-outline text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white border border-gray-200 text-text-muted hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden border-t border-gray-200"
          >
            <div className="space-y-4">
              <Link
                to="/services/browse"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-text-muted hover:text-accent hover:bg-gray-50 transition"
              >
                <Briefcase className="w-5 h-5" />
                <span>Services</span>
              </Link>
              <Link
                to="/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-text-muted hover:text-accent hover:bg-gray-50 transition"
              >
                <Newspaper className="w-5 h-5" />
                <span>News</span>
              </Link>
              <button
                onClick={scrollToFooter}
                className="flex items-center gap-3 p-3 rounded-lg text-text-muted hover:text-accent hover:bg-gray-50 transition w-full text-left"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </button>
              <div className="border-t border-gray-200 my-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg text-text-muted hover:text-accent hover:bg-gray-50 transition"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-4 pt-2 flex flex-col items-center">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-outline w-full justify-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-filled w-full justify-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer
        ref={footerRef}
        className="relative bg-gray-100 border-t border-gray-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="group relative rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={itsmsLogo}
                    alt="ITSMS - Amhara Innovation and Technology Bureau"
                    className="size-10 brightness-95 contrast-95 group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
                <div>
                  <span className="text-text-primary font-heading font-medium text-lg">
                    ITSMS
                  </span>
                  <p className="text-xs text-text-muted">Amhara Region</p>
                </div>
              </div>
              <p className="text-text-muted text-sm mb-4 leading-relaxed">
                Innovation and Technology Service Management System - Empowering
                innovation in the Amhara Region.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-text-muted border border-gray-300 hover:text-accent hover:border-accent transition"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-text-primary font-heading font-medium mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-text-muted hover:text-accent transition text-sm flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-heading font-medium mb-4">
                Support
              </h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-text-muted hover:text-accent transition text-sm flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div id="contact-section">
              <h4 className="text-text-primary font-heading font-medium mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-text-muted text-sm">
                  <MapPin className="w-4 h-4 text-accent mt-0.5" />
                  <span>{footerLinks.contact.address}</span>
                </li>
                <li className="flex items-center gap-3 text-text-muted text-sm">
                  <Mail className="w-4 h-4 text-accent" />
                  <a
                    href={`mailto:${footerLinks.contact.email}`}
                    className="hover:text-accent transition"
                  >
                    {footerLinks.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-text-muted text-sm">
                  <Phone className="w-4 h-4 text-accent" />
                  <a
                    href={`tel:${footerLinks.contact.phone}`}
                    className="hover:text-accent transition"
                  >
                    {footerLinks.contact.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-text-muted text-sm">
              &copy; {new Date().getFullYear()} Amhara National Regional State
              Innovation and Technology Bureau. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
