import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { LampWithCord } from "@/components/ui/LampWithCord";
import { motion } from "framer-motion";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lampIsOn, setLampIsOn] = useState(false);
  const navigate = useNavigate();

  const passwordValidation = {
    hasMinLength: password.length >= 8,
    hasCapital: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = passwordValidation.hasMinLength && 
                          passwordValidation.hasCapital && 
                          passwordValidation.hasSpecial;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password must meet all requirements");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully! You can now log in.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121921] flex items-center justify-center p-6 gap-8 flex-wrap">
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
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
              Create Account
            </CardTitle>
            <p className="text-gray-400 text-sm">Join the Test Duel community</p>
          </CardHeader>
          <CardContent className="pt-2 px-10 pb-12">
            <form onSubmit={handleSignup} className="space-y-5">
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
              
              <div>
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium block mb-2"
                  style={{ color: "#aaa", textShadow: "0 0 5px var(--glow-color)" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300 pr-10"
                    style={{ borderRadius: "10px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <X className="h-3 w-3 text-red-400" />
                      )}
                      <span className={passwordValidation.hasMinLength ? "text-green-400" : "text-gray-500"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasCapital ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <X className="h-3 w-3 text-red-400" />
                      )}
                      <span className={passwordValidation.hasCapital ? "text-green-400" : "text-gray-500"}>
                        One capital letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasSpecial ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <X className="h-3 w-3 text-red-400" />
                      )}
                      <span className={passwordValidation.hasSpecial ? "text-green-400" : "text-gray-500"}>
                        One special character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label 
                  htmlFor="confirmPassword" 
                  className="text-sm font-medium block mb-2"
                  style={{ color: "#aaa", textShadow: "0 0 5px var(--glow-color)" }}
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300 pr-10"
                    style={{ borderRadius: "10px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-gray-400 hover:text-[var(--glow-color)] transition-all duration-300 font-semibold"
                    style={{ textShadow: "0 0 10px var(--glow-color)" }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;