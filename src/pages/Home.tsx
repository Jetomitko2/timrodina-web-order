import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Server, Zap, Shield, Users, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import OrderForm from "@/components/OrderForm";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Home = () => {
  console.log("Home.tsx: Home component rendering");
  
  // Set page title
  useEffect(() => {
    document.title = "TMRD-Home";
  }, []);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  useScrollAnimation();

  if (showOrderForm) {
    return <OrderForm onBack={() => setShowOrderForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8 animate-on-scroll">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 hover-glow">
              <img 
                src="/lovable-uploads/c763e45f-2290-410f-b714-13ceaefded62.png" 
                alt="TimRodina.online Logo" 
                className="w-full h-full rounded-2xl"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              TimRodina.online
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional web hosting solutions with reliable performance and 48/7 support
            </p>
            <Button 
              onClick={() => setShowOrderForm(true)}
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover-scale"
            >
              Place Order
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose TimRodina.online Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              Why Choose TimRodina.online? <span className="text-2xl">⭐</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the difference with our premium hosting solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow animate-on-scroll hover-lift hover-glow">
              <CardHeader>
                <Server className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Reliable Performance</CardTitle>
                <CardDescription>99.9% uptime guarantee with fast loading speeds</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">SSD Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">CDN Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Load Balancing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow animate-on-scroll hover-lift hover-glow">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Advanced Security</CardTitle>
                <CardDescription>Enterprise-grade security for your websites</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">SSL Certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">DDoS Protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Daily Backups</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow animate-on-scroll hover-lift hover-glow">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>48/7 Support</CardTitle>
                <CardDescription>Expert support whenever you need it</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Live Chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Discord Community</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Technical Assistance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              Our Services <span className="text-2xl">🛠️</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-on-scroll hover-lift hover-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Webhosting</CardTitle>
                  <Badge variant="secondary">€2/month</Badge>
                </div>
                <CardDescription>Perfect for personal websites and small projects</CardDescription>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">1GB Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Basic Support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 ring-2 ring-primary/20 animate-on-scroll hover-lift hover-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    PRO
                    <Zap className="w-5 h-5 text-primary" />
                  </CardTitle>
                  <Badge className="bg-primary text-primary-foreground">€3/month</Badge>
                </div>
                <CardDescription>Enhanced features for growing businesses</CardDescription>
              </CardHeader>
               <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">3GB Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Custom Domain Connection</span>
                  </li>
                </ul>
               </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 animate-on-scroll">
            <p className="text-muted-foreground">
              <span className="font-semibold">WordPress Add-on:</span> +€1/month for managed WordPress hosting
            </p>
          </div>
        </div>
      </section>

      {/* Ready to Join Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start your journey with TimRodina.online today and experience premium hosting
          </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll">
            <Button 
              onClick={() => setShowOrderForm(true)}
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover-scale"
            >
              Place Order
            </Button>
            
            <a 
              href="https://discord.gg/qWZASwxuMj" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="flex items-center gap-2 hover-scale">
                Discord Community
                <ExternalLink size={16} />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 bg-secondary/10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 TimRodina.online. All rights reserved.
            </p>
            
            <button 
              onClick={() => window.location.href = "/admin"}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              .
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;