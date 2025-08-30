import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, ExternalLink, Eye, CheckCircle, Clock, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Order {
  id: string;
  order_number: string;
  plan: string;
  wordpress: boolean;
  full_name: string;
  email: string;
  duration: number;
  total_amount: number;
  is_paid: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "TMRD-Admin";
    checkAuth();
    fetchOrders();
  }, []);
  
  useScrollAnimation();

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin");
      return;
    }
    setUser(user);
  };

  const fetchOrders = async () => {
    console.log("Dashboard: Fetching orders...");
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Dashboard: Orders fetched successfully:", data);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ is_paid: true })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, is_paid: true } : order
      ));

      toast({
        title: "Success",
        description: "Order marked as paid",
      });

      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const paidOrders = orders.filter(order => order.is_paid);
  const pendingOrders = orders.filter(order => !order.is_paid);
  
  console.log("Dashboard: Total orders:", orders.length);
  console.log("Dashboard: Paid orders:", paidOrders.length);
  console.log("Dashboard: Pending orders:", pendingOrders.length);

  console.log("Dashboard: Orders state:", orders);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage TimRodina.online orders</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://timrodina.online/webadminpanel" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="flex items-center gap-2">
                Passwords
                <ExternalLink size={16} />
              </Button>
            </a>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-on-scroll hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-on-scroll hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{paidOrders.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-on-scroll hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-on-scroll hover-glow">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.full_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{order.plan}</span>
                        {order.wordpress && (
                          <Badge variant="secondary" className="text-xs">+WP</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>€{order.total_amount}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.is_paid ? "default" : "secondary"}
                        className={order.is_paid ? "bg-green-500" : "bg-orange-500"}
                      >
                        {order.is_paid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">Customer</label>
                    <p className="font-medium">{selectedOrder.full_name}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Plan</label>
                    <p className="font-medium capitalize">{selectedOrder.plan}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">WordPress</label>
                    <p className="font-medium">{selectedOrder.wordpress ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Duration</label>
                    <p className="font-medium">{selectedOrder.duration} month{selectedOrder.duration > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Total Amount</label>
                    <p className="font-medium">€{selectedOrder.total_amount}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Status</label>
                    <Badge 
                      variant={selectedOrder.is_paid ? "default" : "secondary"}
                      className={selectedOrder.is_paid ? "bg-green-500" : "bg-orange-500"}
                    >
                      {selectedOrder.is_paid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>

                {!selectedOrder.is_paid && (
                  <Button 
                    onClick={() => markAsPaid(selectedOrder.id)}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;