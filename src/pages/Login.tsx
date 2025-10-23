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
import { LampCharacter } from "@/components/ui/LampCharacter";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lampState, setLampState] = useState<"off" | "on" | "happy" | "sad">("off");
  const [isFocused, setIsFocused] = useState(false);
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
        setLampState("sad");
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        setTimeout(() => setLampState(isFocused ? "on" : "off"), 2000);
        return;
      }

      setLampState("happy");
      toast.success("Successfully logged in!");
      setTimeout(() => navigate("/duel"), 1000);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-background dark:via-background dark:to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 dark:bg-gradient-card backdrop-blur-sm border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <LampCharacter state={lampState} />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Welcome back ✨
              </CardTitle>
              <p className="text-muted-foreground mt-2 text-sm">
                Sign in to brighten your day — the lamp is cheering you on
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true);
                      setLampState("on");
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      setLampState("off");
                    }}
                    required
                    placeholder="you@example.com"
                    className="mt-1.5 bg-white/50 dark:bg-background/50 border-2 focus:border-yellow-400 transition-all duration-300"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true);
                      setLampState("on");
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      setLampState("off");
                    }}
                    required
                    placeholder="••••••••"
                    className="mt-1.5 bg-white/50 dark:bg-background/50 border-2 focus:border-yellow-400 transition-all duration-300"
                  />
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base py-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⚡
                        </motion.span>
                        Signing in...
                      </span>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;