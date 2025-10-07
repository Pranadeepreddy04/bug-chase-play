import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number with country code");
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (!data.user) {
        toast.error("User creation failed");
        return;
      }

      // Create profile with phone number
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          phone_number: phoneNumber,
          phone_verified: false,
        });

      if (profileError) {
        toast.error("Failed to create profile");
        return;
      }

      // Send OTP
      const { error: otpError } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber, userId: data.user.id }
      });

      if (otpError) {
        toast.error("Failed to send OTP. Please try again.");
        return;
      }

      toast.success("OTP sent! Please check your phone.");
      navigate("/verify-otp", { state: { userId: data.user.id } });
    } catch (error) {
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Create Account</CardTitle>
            </div>
            <p className="text-muted-foreground">Join the Test Duel community</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="Enter phone with country code (e.g., +1234567890)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1234567890)
                </p>
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span className={passwordValidation.hasMinLength ? "text-success" : "text-muted-foreground"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasCapital ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span className={passwordValidation.hasCapital ? "text-success" : "text-muted-foreground"}>
                        One capital letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasSpecial ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span className={passwordValidation.hasSpecial ? "text-success" : "text-muted-foreground"}>
                        One special character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;