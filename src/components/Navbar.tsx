import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ showLanguageSwitcher = false }: { showLanguageSwitcher?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage } = showLanguageSwitcher ? useLanguage() : { language: 'en', toggleLanguage: () => {} };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm hover-glow">
              <img 
                src="/lovable-uploads/c763e45f-2290-410f-b714-13ceaefded62.png" 
                alt="TimRodina.online Logo" 
                className="w-full h-full rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-foreground">TimRodina.online</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {showLanguageSwitcher && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'English' : 'Slovenčina'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => language !== 'en' && toggleLanguage()}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => language !== 'sk' && toggleLanguage()}>
                    Slovenčina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <a 
              href="https://timrodina.online/dashlaboard" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">Dashboard</Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 animate-on-scroll">
            {showLanguageSwitcher && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="w-full justify-start flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'Switch to Slovenčina' : 'Switch to English'}
              </Button>
            )}
            <a 
              href="https://timrodina.online/dashlaboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;