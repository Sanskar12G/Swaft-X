import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FareComparison from "../components/FareComparision";
import FeaturesSection from "../components/FeaturesSection";
import CitiesSection from "../components/CitiesSection";
import CtaSection from "../components/CtaSection";
import  Footer  from "../components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FareComparison/>
      <FeaturesSection/>
      <CitiesSection/>
      <CtaSection/>
      <Footer/>
    </div>
  );
};

export default Index;
