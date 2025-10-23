import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { LampWithCord } from "@/components/ui/LampWithCord";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lampIsOn, setLampIsOn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Successfully logged in!");
      setTimeout(() => navigate("/duel"), 500);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-10 pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border-2 border-white/10 text-white placeholder:text-gray-600 focus:border-[var(--glow-color)] focus:shadow-[0_0_10px_var(--glow-color)] focus:bg-white/8 transition-all duration-300"
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none text-gray-400"
                  >
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-500 hover:text-[var(--glow-color)] transition-all duration-300"
                  style={{ textShadow: "0 0 10px var(--glow-color)" }}
                >
                  Forgot password?
                </Link>
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
                {isLoading ? "Signing in..." : "Login"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-gray-400 hover:text-[var(--glow-color)] transition-all duration-300 font-semibold"
                    style={{ textShadow: "0 0 10px var(--glow-color)" }}
                  >
                    Sign up
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

export default Login;