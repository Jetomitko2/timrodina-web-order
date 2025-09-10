import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusEmailRequest {
  status: 'online' | 'offline' | 'maintenance';
  reason?: string;
}

const getEmailTemplate = (status: string, reason?: string) => {
  const baseStyles = `
    <style>
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
      .content { background: #f8f9fa; padding: 30px; }
      .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
      .online { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
      .offline { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      .maintenance { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
      .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
    </style>
  `;

  if (status === 'online') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Webhosting je online</title>
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🟢 Webhosting je online</h1>
          </div>
          <div class="content">
            <div class="status-badge online">✅ ONLINE</div>
            <h2>Vaše stránky fungujú bez problémov!</h2>
            <p>Dobrá správa! Váš webhosting je plne funkčný a vaše webstránky fungujú bez akýchkoľvek problémov.</p>
            <p>Môžete pokračovať v normálnom používaní vašich webstránok.</p>
            <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #28a745; border-radius: 4px;">
              <strong>Status:</strong> Všetky služby fungujú normálne<br>
              <strong>Dostupnosť:</strong> 100%<br>
              <strong>Posledná aktualizácia:</strong> ${new Date().toLocaleString('sk-SK')}
            </div>
          </div>
          <div class="footer">
            <p>TimRodina.online Team<br>
            <small>Ak máte akékolv otázky, neváhajte nás kontaktovať.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (status === 'offline') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Webhosting je offline</title>
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
            <h1>🔴 Webhosting je offline</h1>
          </div>
          <div class="content">
            <div class="status-badge offline">❌ OFFLINE</div>
            <h2>Vaše webstránky momentálne nefungujú</h2>
            <p>Ospravedlňujeme sa, ale váš webhosting je momentálne nedostupný z nasledovného dôvodu:</p>
            <div style="margin: 20px 0; padding: 20px; background: white; border-left: 4px solid #dc3545; border-radius: 4px;">
              <strong>Dôvod:</strong> ${reason || 'Technické problémy'}
            </div>
            <p>Pracujeme na odstránení problému a hneď ako bude webhosting opäť funkčný, dáme vám vedieť.</p>
            <p><strong>Odhad opravy:</strong> Čo najskôr</p>
            <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <strong>⚠️ Čo to znamená:</strong><br>
              • Vaše webstránky sú dočasne nedostupné<br>
              • E-maily môžu byť tiež ovplyvnené<br>
              • Všetky dáta sú v bezpečí<br>
              • Okamžite vás informujeme o obnovení služby
            </div>
          </div>
          <div class="footer">
            <p>TimRodina.online Team<br>
            <small>Ďakujeme za vašu trpezlivosť a porozumenie.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (status === 'maintenance') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Webhosting sa prerába</title>
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);">
            <h1>🔧 Webhosting sa prerába</h1>
          </div>
          <div class="content">
            <div class="status-badge maintenance">⚠️ ÚDRŽBA</div>
            <h2>Prebiehajú údržbárske práce</h2>
            <p>Informujeme vás, že na vašom webhostingu práve prebieha údržba a aktualizácie.</p>
            <div style="margin: 20px 0; padding: 20px; background: white; border-left: 4px solid #ffc107; border-radius: 4px;">
              <strong>📋 Čo môžete očakávať:</strong><br>
              • Webstránky by mali fungovať normálne<br>
              • Admin panel / dashboard môže byť dostupný<br>
              • Odporúčame nevykonávať dôležité zmeny<br>
              • Niektoré zmeny sa môžu neuložiť správne
            </div>
            <div style="margin-top: 20px; padding: 20px; background: #e7f3ff; border-left: 4px solid #0066cc; border-radius: 4px;">
              <strong>💡 Naše odporúčanie:</strong><br>
              Počas údržby odporúčame nevykonávať žiadne dôležité úpravy na vašich webstránkach, 
              pretože existuje riziko, že sa zmeny neuložia správne.
            </div>
            <p>Údržba by mala byť dokončená čoskoro. Ďakujeme za pochopenie.</p>
          </div>
          <div class="footer">
            <p>TimRodina.online Team<br>
            <small>Pracujeme na zlepšení našich služieb pre vás.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  return '';
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Status email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { status, reason }: StatusEmailRequest = await req.json();
    console.log("Request data:", { status, reason });

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all paid orders to get customer emails
    const { data: orders, error } = await supabase
      .from("orders")
      .select("email, full_name")
      .eq("is_paid", true);

    if (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }

    console.log("Found paid orders:", orders?.length);

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: "No paid orders found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get unique emails
    const uniqueEmails = [...new Set(orders.map(order => order.email))];
    console.log("Unique emails to send to:", uniqueEmails.length);

    // Prepare email content
    const subjects = {
      online: "✅ Webhosting je online - Vaše stránky fungujú",
      offline: "🔴 Webhosting je offline - Dočasná nedostupnosť",
      maintenance: "🔧 Webhosting sa prerába - Údržbárske práce"
    };

    const htmlContent = getEmailTemplate(status, reason);

    // Send emails to all customers
    const emailPromises = uniqueEmails.map(async (email) => {
      console.log("Sending email to:", email);
      return resend.emails.send({
        from: "TimRodina Status <status@timrodina.online>",
        to: [email],
        subject: subjects[status],
        html: htmlContent,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    // Count successful sends
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Email sending complete: ${successful} successful, ${failed} failed`);

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send email to ${uniqueEmails[index]}:`, result.reason);
      }
    });

    return new Response(
      JSON.stringify({ 
        message: "Status emails sent",
        successful,
        failed,
        totalEmails: uniqueEmails.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error: any) {
    console.error("Error in send-status-email function:", error);
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