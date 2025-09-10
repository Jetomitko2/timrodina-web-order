import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewOrderNotification {
  orderNumber: string;
  fullName: string;
  email: string;
  plan: string;
  wordpress: boolean;
  duration: number;
  totalAmount: number;
}

const getOrderNotificationTemplate = (orderData: NewOrderNotification) => {
  const baseStyles = `
    <style>
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { background: #f8f9fa; padding: 30px; }
      .info-section { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
      .order-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
      .detail-item { background: #f8f9fa; padding: 12px; border-radius: 6px; }
      .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      .badge { display: inline-block; padding: 4px 12px; background: #667eea; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; }
      .total-badge { background: #28a745; padding: 8px 16px; border-radius: 6px; color: white; font-weight: bold; text-align: center; }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nová objednávka - ${orderData.orderNumber}</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Nová objednávka!</h1>
          <p style="margin: 0; opacity: 0.9;">Objednávka číslo: <strong>${orderData.orderNumber}</strong></p>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h2 style="margin-top: 0; color: #343a40;">📋 Informácie o zákazníkovi</h2>
            <div class="order-details">
              <div class="detail-item">
                <strong>Meno:</strong><br>
                ${orderData.fullName}
              </div>
              <div class="detail-item">
                <strong>E-mail:</strong><br>
                <a href="mailto:${orderData.email}" style="color: #667eea;">${orderData.email}</a>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2 style="margin-top: 0; color: #343a40;">📦 Detail objednávky</h2>
            <div class="order-details">
              <div class="detail-item">
                <strong>Plán:</strong><br>
                <span class="badge">${orderData.plan.toUpperCase()}</span>
              </div>
              <div class="detail-item">
                <strong>WordPress:</strong><br>
                ${orderData.wordpress ? '✅ Áno (+€1/mesiac)' : '❌ Nie'}
              </div>
              <div class="detail-item">
                <strong>Trvanie:</strong><br>
                ${orderData.duration} mesiac${orderData.duration > 1 ? 'ov' : ''}
              </div>
              <div class="detail-item">
                <strong>Celková suma:</strong><br>
                <span style="font-size: 18px; color: #28a745; font-weight: bold;">€${orderData.totalAmount}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2 style="margin-top: 0; color: #343a40;">⏰ Čas objednávky</h2>
            <p style="margin: 0; color: #666;">
              ${new Date().toLocaleString('sk-SK', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>

          <div class="total-badge" style="margin-top: 20px;">
            💰 Celková suma: €${orderData.totalAmount}
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-left: 4px solid #0066cc; border-radius: 4px;">
            <strong>📝 Ďalšie kroky:</strong><br>
            1. Skontroluj e-mail zákazníka<br>
            2. Potvrď platbu v admin paneli<br>
            3. Nastav hosting account<br>
            4. Kontaktuj zákazníka s ďalšími informáciami
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">
            <strong>TimRodina.online Admin Notifikácia</strong><br>
            <small>Automaticky generovaný e-mail pre novú objednávku</small>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("New order notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: NewOrderNotification = await req.json();
    console.log("New order data:", orderData);

    const htmlContent = getOrderNotificationTemplate(orderData);

    console.log("Sending notification email to: timotejkucharcik116@gmail.com");

    const emailResponse = await resend.emails.send({
      from: "TimRodina Orders <status@timrodina.online>",
      to: ["timotejkucharcik116@gmail.com"],
      subject: `🎉 Nová objednávka #${orderData.orderNumber} - ${orderData.fullName}`,
      html: htmlContent,
    });

    console.log("Order notification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        message: "Order notification sent successfully",
        emailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error: any) {
    console.error("Error in notify-new-order function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);