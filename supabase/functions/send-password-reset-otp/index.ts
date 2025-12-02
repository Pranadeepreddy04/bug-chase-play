import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    console.log('Password reset OTP request for:', email);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find user by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.log('No profile found for email:', email);
      // Don't reveal if email exists or not for security
      return new Response(
        JSON.stringify({ success: true, message: 'If the email exists, an OTP has been sent.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_otp: otp,
        otp_expires_at: expiresAt.toISOString(),
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Error storing OTP:', updateError);
      throw new Error('Failed to store OTP');
    }

    // Send OTP via Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const userName = profile.display_name || email.split('@')[0];

    const { error: emailError } = await resend.emails.send({
      from: 'Test Duel <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #333;">Here is your OTP:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw new Error('Failed to send email');
    }

    console.log('Password reset OTP sent successfully to:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-password-reset-otp:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
