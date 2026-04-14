import { useAuth } from "../../../hooks/useAuth";
import { useStats } from "../../../hooks/useStats";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ProgramsSection from "../components/ProgramsSection";
import ServicesPreview from "../components/ServicesPreview";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { stats, loading, fetchStats } = useStats();

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApply = (path) => {
    if (isAuthenticated) {
      window.location.href = path;
    } else {
      sessionStorage.setItem("redirectAfterLogin", path);
      window.location.href = "/login";
    }
  };

  return (
    <>
      <HeroSection />
      {/* <StatsSection stats={stats} loading={loading} /> */}
      <ProgramsSection
        isAuthenticated={isAuthenticated}
        onApply={handleApply}
      />
      <ServicesPreview />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
