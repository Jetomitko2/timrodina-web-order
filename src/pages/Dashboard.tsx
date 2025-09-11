import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  LogOut, 
  ExternalLink, 
  Eye, 
  CheckCircle, 
  Clock, 
  Package, 
  Mail, 
  Send, 
  TrendingUp, 
  Users, 
  Euro,
  Search,
  Filter,
  Loader2,
  Calendar,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'online' | 'offline' | 'maintenance' | ''>('');
  const [offlineReason, setOfflineReason] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Dashboard - TimRodina Admin";
    initializeDashboard();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const initializeDashboard = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log("User not authenticated, redirecting to login");
        navigate("/admin", { replace: true });
        return;
      }

      setUser(user);
      await fetchOrders();
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      navigate("/admin", { replace: true });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať objednávky",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        statusFilter === 'paid' ? order.is_paid : !order.is_paid
      );
    }

    setFilteredOrders(filtered);
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
        title: "Úspech",
        description: "Objednávka označená ako zaplatená",
      });

      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať objednávku",
        variant: "destructive",
      });
    }
  };

  const sendStatusEmail = async () => {
    if (!selectedStatus) return;
    
    if (selectedStatus === 'offline' && !offlineReason.trim()) {
      toast({
        title: "Chyba",
        description: "Prosím zadajte dôvod pre offline status",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-status-email', {
        body: { 
          status: selectedStatus,
          reason: selectedStatus === 'offline' ? offlineReason : undefined
        }
      });

      if (error) throw error;

      toast({
        title: "Úspech",
        description: `Status email (${selectedStatus}) bol úspešne odoslaný všetkým zákazníkom`,
      });

      setStatusDialogOpen(false);
      setSelectedStatus('');
      setOfflineReason('');
    } catch (error) {
      console.error("Error sending status email:", error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odoslať status email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin", { replace: true });
  };

  const paidOrders = orders.filter(order => order.is_paid);
  const pendingOrders = orders.filter(order => !order.is_paid);
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total_amount, 0);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">Načítavam dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400">TimRodina.online správa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setStatusDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Status Email
              </Button>
              <a 
                href="https://timrodina.online/webadminpanel" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Passwords
                </Button>
              </a>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-slate-300 dark:border-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Odhlásiť
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Celkové objednávky</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{orders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Všetky objednávky v systéme</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Zaplatené</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{paidOrders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Úspešne zaplatené objednávky</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Čakajúce</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingOrders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Čakajúce na platbu</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Celkové tržby</CardTitle>
              <Euro className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">€{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Z zaplatených objednávok</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Správa objednávok</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Prehľad a správa všetkých zákazníckych objednávok
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Hľadať objednávky..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: 'all' | 'paid' | 'pending') => setStatusFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-300 dark:border-slate-600">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky</SelectItem>
                    <SelectItem value="paid">Zaplatené</SelectItem>
                    <SelectItem value="pending">Čakajúce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Číslo objednávky</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Zákazník</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Plán</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Suma</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Dátum</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500 dark:text-slate-400">
                        {searchTerm || statusFilter !== 'all' 
                          ? "Žiadne objednávky nezodpovedajú filtrom" 
                          : "Žiadne objednávky"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-mono font-medium text-slate-900 dark:text-white">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{order.full_name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium text-slate-900 dark:text-white">{order.plan}</span>
                            {order.wordpress && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                +WP
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-white">
                          €{order.total_amount}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={order.is_paid 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                            }
                          >
                            {order.is_paid ? "Zaplatené" : "Čakajúce"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString('sk-SK')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Detail objednávky
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Objednávka #{selectedOrder?.order_number}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Zákazník</label>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedOrder.full_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedOrder.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Plán</label>
                    <p className="text-slate-900 dark:text-white font-medium capitalize">{selectedOrder.plan}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">WordPress</label>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedOrder.wordpress ? "Áno" : "Nie"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Trvanie</label>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedOrder.duration} mesiac{selectedOrder.duration > 1 ? "ov" : ""}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Celková suma</label>
                    <p className="text-slate-900 dark:text-white font-medium text-lg">€{selectedOrder.total_amount}</p>
                  </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Status platby</label>
                    <Badge 
                      className={selectedOrder.is_paid 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                      }
                    >
                      {selectedOrder.is_paid ? "Zaplatené" : "Čakajúce"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Dátum vytvorenia</label>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {new Date(selectedOrder.created_at).toLocaleDateString('sk-SK')}
                    </p>
                  </div>
                </div>

                {!selectedOrder.is_paid && (
                  <>
                    <Separator className="bg-slate-200 dark:bg-slate-700" />
                    <Button 
                      onClick={() => markAsPaid(selectedOrder.id)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Označiť ako zaplatené
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Email Dialog */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Odoslať Status Email
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Vyberte status a odošlite email všetkým zákazníkom so zaplatenými objednávkami
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300">Status</Label>
                <Select value={selectedStatus} onValueChange={(value: 'online' | 'offline' | 'maintenance') => setSelectedStatus(value)}>
                  <SelectTrigger className="border-slate-300 dark:border-slate-600">
                    <SelectValue placeholder="Vyberte status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online - Všetko funguje
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Offline - Nefunguje
                      </div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Údržba - Prevádzka obmedzená
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus === 'offline' && (
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-slate-700 dark:text-slate-300">Dôvod</Label>
                  <Textarea
                    id="reason"
                    value={offlineReason}
                    onChange={(e) => setOfflineReason(e.target.value)}
                    placeholder="Zadajte dôvod prečo je služba offline..."
                    className="border-slate-300 dark:border-slate-600 min-h-[100px]"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStatusDialogOpen(false)}
                  className="flex-1 border-slate-300 dark:border-slate-600"
                >
                  Zrušiť
                </Button>
                <Button 
                  onClick={sendStatusEmail}
                  disabled={!selectedStatus || sendingEmail}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Odosielam...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Odoslať
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;