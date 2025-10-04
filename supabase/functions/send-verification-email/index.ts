import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") || "your-hook-secret";

// React Email Template Component
const VerificationEmail = ({ confirmationUrl }: { confirmationUrl: string }) => {
  const {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Button,
  } = require("npm:@react-email/components@0.0.22");

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Verify your Test Duel account"),
    React.createElement(
      Body,
      { style: main },
      React.createElement(
        Container,
        { style: container },
        React.createElement(
          Heading,
          { style: h1 },
          "Thanks for creating an account!"
        ),
        React.createElement(
          Text,
          { style: text },
          "Welcome to Test Duel! Click the button below to verify your email and start playing."
        ),
        React.createElement(
          "div",
          { style: buttonContainer },
          React.createElement(
            Link,
            {
              href: confirmationUrl,
              style: button,
            },
            "Verify Email"
          )
        ),
        React.createElement(
          Text,
          { style: { ...text, marginTop: "24px", fontSize: "12px", color: "#898989" } },
          "If the button doesn't work, copy and paste this link into your browser:"
        ),
        React.createElement(
          Link,
          { href: confirmationUrl, style: link },
          confirmationUrl
        )
      )
    )
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "580px",
};

const h1 = {
  color: "#1a1a1a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  padding: "0",
};

const text = {
  color: "#404040",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const link = {
  color: "#4F46E5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Verification email function invoked");

  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Verify webhook signature
    const wh = new Webhook(hookSecret);
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: { email: string };
      email_data: {
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    console.log("Processing verification email for:", user.email);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    // Render the React email template
    const html = await renderAsync(
      React.createElement(VerificationEmail, { confirmationUrl })
    );

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Test Duel <onboarding@resend.dev>", // Change to your verified domain
      to: [user.email],
      subject: "Verify your Test Duel account",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || "UNKNOWN_ERROR",
        },
      }),
      {
        status: error.code === 401 ? 401 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
