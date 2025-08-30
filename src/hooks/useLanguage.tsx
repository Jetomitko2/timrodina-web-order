import { useState, createContext, useContext } from 'react';

interface LanguageContextType {
  language: 'en' | 'sk';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: "Home",
    language: "Language",
    
    // Hero Section
    heroTitle: "TimRodina.online",
    heroDescription: "Professional web hosting solutions with reliable performance and 24/7 support",
    placeOrder: "Place Order",
    
    // Why Choose Section
    whyChooseTitle: "Why Choose TimRodina.online?",
    whyChooseDescription: "Experience the difference with our premium hosting solutions",
    
    // Features
    reliablePerformance: "Reliable Performance",
    reliableDescription: "99.9% uptime guarantee with fast loading speeds",
    advancedSecurity: "Advanced Security",
    securityDescription: "Enterprise-grade security for your websites",
    support247: "24/7 Support",
    supportDescription: "Expert support whenever you need it",
    
    // Feature Lists
    ssdStorage: "SSD Storage",
    cdnIntegration: "CDN Integration",
    loadBalancing: "Load Balancing",
    sslCertificates: "SSL Certificates",
    ddosProtection: "DDoS Protection",
    dailyBackups: "Daily Backups",
    liveChat: "Live Chat",
    discordCommunity: "Discord Community",
    technicalAssistance: "Technical Assistance",
    
    // Services
    ourServices: "Our Services",
    webhosting: "Webhosting",
    webhostingDescription: "Perfect for personal websites and small projects",
    pro: "PRO",
    proDescription: "Enhanced features for growing businesses",
    storage1gb: "1GB Storage",
    storage3gb: "3GB Storage",
    basicSupport: "Basic Support",
    prioritySupport: "Priority Support",
    customDomainConnection: "Custom Domain Connection",
    wordpressAddon: "WordPress Add-on: +€1/month for managed WordPress hosting",
    
    // Ready to Join
    readyToJoin: "Ready to Join?",
    readyDescription: "Start your journey with TimRodina.online today and experience premium hosting",
    discordCommunityButton: "Discord Community",
    
    // Footer
    allRightsReserved: "© 2025 TimRodina.online. All rights reserved."
  },
  sk: {
    // Navigation
    home: "Domov",
    language: "Jazyk",
    
    // Hero Section
    heroTitle: "TimRodina.online",
    heroDescription: "Profesionálne webhostingové riešenia so spoľahlivým výkonom a 24/7 podporou",
    placeOrder: "Objednať",
    
    // Why Choose Section
    whyChooseTitle: "Prečo si vybrať TimRodina.online?",
    whyChooseDescription: "Zažite rozdiel s našimi prémiové hostingovými riešeniami",
    
    // Features
    reliablePerformance: "Spoľahlivý výkon",
    reliableDescription: "99.9% záruka dostupnosti s rýchlym načítavaním",
    advancedSecurity: "Pokročilá bezpečnosť",
    securityDescription: "Podniková bezpečnosť pre vaše webové stránky",
    support247: "24/7 Podpora",
    supportDescription: "Odborná podpora kedykoľvek ju potrebujete",
    
    // Feature Lists
    ssdStorage: "SSD Úložisko",
    cdnIntegration: "CDN Integrácia",
    loadBalancing: "Vyrovnávanie záťaže",
    sslCertificates: "SSL Certifikáty",
    ddosProtection: "DDoS Ochrana",
    dailyBackups: "Denné zálohy",
    liveChat: "Live Chat",
    discordCommunity: "Discord Komunita",
    technicalAssistance: "Technická podpora",
    
    // Services
    ourServices: "Naše služby",
    webhosting: "Webhosting",
    webhostingDescription: "Perfektný pre osobné stránky a malé projekty",
    pro: "PRO",
    proDescription: "Rozšírené funkcie pre rastúce podniky",
    storage1gb: "1GB Úložisko",
    storage3gb: "3GB Úložisko",
    basicSupport: "Základná podpora",
    prioritySupport: "Prioritná podpora",
    customDomainConnection: "Pripojenie vlastnej domény",
    wordpressAddon: "WordPress doplnok: +€1/mesiac za spravovaný WordPress hosting",
    
    // Ready to Join
    readyToJoin: "Pripravený sa pripojiť?",
    readyDescription: "Začnite svoju cestu s TimRodina.online ešte dnes a zažite prémiový hosting",
    discordCommunityButton: "Discord Komunita",
    
    // Footer
    allRightsReserved: "© 2025 TimRodina.online. Všetky práva vyhradené."
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'sk'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sk' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};