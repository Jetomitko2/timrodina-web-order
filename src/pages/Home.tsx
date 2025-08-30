import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/hooks/useLanguage";
import HomeContent from "./HomeContent";

const Home = () => {
  console.log("Home.tsx: Home component rendering");
  
  // Set page title
  useEffect(() => {
    document.title = "TMRD-Home";
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
        <Navbar showLanguageSwitcher={true} />
        <HomeContent />
      </div>
    </LanguageProvider>
  );
};

export default Home;