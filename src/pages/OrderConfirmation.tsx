import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Home } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const { orderNumber, totalAmount, plan, wordpress, fullName, email, duration } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                Thank you for your order!
              </CardTitle>
              <CardDescription>Your hosting order has been successfully submitted</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Order Number */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-primary mb-2">
                  {orderNumber}
                </h2>
                <p className="text-lg text-muted-foreground">Order Number</p>
              </div>

              {/* Order Details */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{plan}</span>
                      <Badge variant="outline" className="text-xs">
                        €{plan === "pro" ? 3 : 2}/month
                      </Badge>
                    </div>
                  </div>
                  {wordpress && (
                    <div className="flex justify-between">
                      <span>WordPress Add-on:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Yes</span>
                        <Badge variant="outline" className="text-xs">
                          +€1/month
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{duration} month{duration > 1 ? "s" : ""}</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-primary">€{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-3">Payment Instructions</h3>
                <p className="text-sm text-foreground mb-4">
                  To complete your order, please make a payment of <strong>€{totalAmount}</strong> using the link below. 
                  In the payment notes, please include your order number: <strong>{orderNumber}</strong>
                </p>
                
                <a 
                  href="https://streamelements.com/jetomit_bio_offi/tip" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-gradient-to-r from-primary to-accent flex items-center gap-2">
                    Pay Now (€{totalAmount})
                    <ExternalLink size={16} />
                  </Button>
                </a>
              </div>

              {/* Important Notes */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Important Notes</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Please include the order number <strong>{orderNumber}</strong> in your payment notes</li>
                  <li>• Your hosting service will be activated within 24 hours after payment confirmation</li>
                  <li>• You will receive login credentials via email once your service is ready</li>
                  <li>• For any questions, contact our support team on Discord</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  Back to Home
                </Button>
                
                <a 
                  href="https://discord.gg/qWZASwxuMj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    Join Discord Community
                    <ExternalLink size={16} />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;