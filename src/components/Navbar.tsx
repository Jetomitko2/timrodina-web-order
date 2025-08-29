import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/c763e45f-2290-410f-b714-13ceaefded62.png" 
            alt="TimRodina.online Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="font-bold text-xl text-foreground">TimRodina.online</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          
          <a 
            href="https://discord.gg/qWZASwxuMj" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors flex items-center space-x-1"
          >
            <span>Support</span>
            <ExternalLink size={14} />
          </a>
          
          <a 
            href="https://timrodina.online/dashlaboard" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="rounded-full">
              Dashboard
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;