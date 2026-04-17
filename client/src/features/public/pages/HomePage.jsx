import { useAuth } from "../../../hooks/useAuth";
import HeroSection from "../components/HeroSection";
import ProgramsSection from "../components/ProgramsSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

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
      <ProgramsSection
        isAuthenticated={isAuthenticated}
        onApply={handleApply}
      />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
