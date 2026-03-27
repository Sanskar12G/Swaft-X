import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import BookingPanel from "@/components/BookingPanel";

type View = "home" | "booking";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>RideX - The Future of Urban Mobility | AI-Powered Ride Hailing</title>
        <meta 
          name="description" 
          content="Experience seamless rides with RideX. AI-powered route intelligence, real-time tracking, and unmatched safety features. Book your ride in seconds." 
        />
        <meta name="keywords" content="ride hailing, taxi app, uber alternative, ride booking, AI rides, urban mobility" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
        
        <main className="pt-16 md:pt-20">
          {currentView === "home" && (
            <HeroSection onBookNow={() => handleNavigate("booking")} />
          )}
          {currentView === "booking" && (
            <BookingPanel onBack={() => handleNavigate("home")} />
          )}
        </main>
      </div>
    </>
  );
};

export default Index;
