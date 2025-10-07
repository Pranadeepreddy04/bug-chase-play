import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found. Please sign up again.",
      });
      navigate("/signup");
      return;
    }

    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user's stored OTP and expiry
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('verification_otp, otp_expires_at')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch verification data');
      }

      // Check if OTP has expired
      if (new Date(profile.otp_expires_at) < new Date()) {
        toast({
          variant: "destructive",
          title: "OTP Expired",
          description: "Your OTP has expired. Please request a new one.",
        });
        return;
      }

      // Verify OTP
      if (profile.verification_otp !== otp) {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect.",
        });
        return;
      }

      // Mark phone as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_verified: true,
          verification_otp: null,
          otp_expires_at: null,
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error('Failed to verify phone number');
      }

      toast({
        title: "Success!",
        description: "Your phone number has been verified. You can now log in.",
      });

      navigate("/login");
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "An error occurred during verification. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', userId)
        .single();

      if (!profile?.phone_number) {
        throw new Error('Phone number not found');
      }

      const { error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: profile.phone_number, userId }
      });

      if (error) throw error;

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone.",
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-width-md">
        <Link 
          to="/signup" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Signup
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResendOTP}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}