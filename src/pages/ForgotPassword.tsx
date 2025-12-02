import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Mail, KeyRound, Lock } from "lucide-react";
import { LampWithCord } from "@/components/ui/LampWithCord";
import { motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = 'email' | 'otp' | 'password';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [lampIsOn, setLampIsOn] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset-otp', {
        body: { email }
      });

      if (error) throw error;

      toast.success("OTP sent to your email!");
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Password must contain at least one capital letter");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-password-reset-otp', {
        body: { email, otp, newPassword }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast.success("Password reset successful! Please login.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="text-center mb-4">
              <Mail className="w-12 h-12 mx-auto mb-2 text-[var(--glow-color)]" />
              <p className="text-gray-400 text-sm">Enter your email to receive a reset code</p>
            </div>
            <div>
              <Label 
                htmlFor="email" 
                className="text-sm font-medium block mb-2"
                style={{ color: "#aaa", textShadow: "0 0 5px var(--glow-color)" }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base py-6 border-none" 
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, var(--glow-color), var(--glow-color-dark))",
                borderRadius: "10px"
              }}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-4">
              <KeyRound className="w-12 h-12 mx-auto mb-2 text-[var(--glow-color)]" />
              <p className="text-gray-400 text-sm">Enter the 6-digit code sent to your email</p>
            </div>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-white/5 border-white/20 text-white" />
                  <InputOTPSlot index={1} className="bg-white/5 border-white/20 text-white" />
                  <InputOTPSlot index={2} className="bg-white/5 border-white/20 text-white" />
                  <InputOTPSlot index={3} className="bg-white/5 border-white/20 text-white" />
                  <InputOTPSlot index={4} className="bg-white/5 border-white/20 text-white" />
                  <InputOTPSlot index={5} className="bg-white/5 border-white/20 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              type="submit" 
              className="w-full text-white font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base py-6 border-none" 
              disabled={isLoading || otp.length !== 6}
              style={{
                background: "linear-gradient(135deg, var(--glow-color), var(--glow-color-dark))",
                borderRadius: "10px"
              }}
            >
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-gray-400 text-sm hover:text-[var(--glow-color)] transition-colors"
            >
              Didn't receive code? Send again
            </button>
          </form>
        );

      case 'password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-4">
              <Lock className="w-12 h-12 mx-auto mb-2 text-[var(--glow-color)]" />
              <p className="text-gray-400 text-sm">Create your new password</p>
            </div>
            <div>
              <Label 
                htmlFor="newPassword" 
                className="text-sm font-medium block mb-2"
                style={{ color: "#aaa", textShadow: "0 0 5px var(--glow-color)" }}
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div>
              <Label 
                htmlFor="confirmPassword" 
                className="text-sm font-medium block mb-2"
                style={{ color: "#aaa", textShadow: "0 0 5px var(--glow-color)" }}
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p className={newPassword.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</p>
              <p className={/[A-Z]/.test(newPassword) ? "text-green-500" : ""}>• At least one capital letter</p>
              <p className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-500" : ""}>• At least one special character</p>
            </div>
            <Button 
              type="submit" 
              className="w-full text-white font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base py-6 border-none" 
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, var(--glow-color), var(--glow-color-dark))",
                borderRadius: "10px"
              }}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#121921] flex items-center justify-center p-6 gap-8 flex-wrap">
      <div className="absolute top-6 left-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      <LampWithCord isOn={lampIsOn} onToggle={setLampIsOn} />
        
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: lampIsOn ? 1 : 0,
          scale: lampIsOn ? 1 : 0.8,
          y: lampIsOn ? 0 : 20
        }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ pointerEvents: lampIsOn ? "all" : "none" }}
      >
        <Card 
          className="backdrop-blur-sm border-2 shadow-2xl min-w-[320px]"
          style={{
            background: "rgba(18, 25, 33, 0.9)",
            borderColor: lampIsOn ? "var(--glow-color)" : "transparent",
            boxShadow: lampIsOn 
              ? "0 0 15px rgba(255, 255, 255, 0.1), 0 0 30px var(--glow-color), inset 0 0 15px rgba(255, 255, 255, 0.05)"
              : "0 0 0px rgba(255, 255, 255, 0)"
          }}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle 
              className="text-3xl font-bold text-white mb-2"
              style={{ textShadow: "0 0 8px var(--glow-color)" }}
            >
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-10 pb-12">
            {renderStepContent()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
