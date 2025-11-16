import {useState, useEffect, useContext} from "react";
import React from 'react';

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trophy, LogIn, UserPlus, LogOut, User as UserIcon } from "lucide-react";

import {MyContext} from "@/App";

// we need to import the index page into here (pages)
// import Header from "@/components/ui/header";

import Index from "@/pages/Index.tsx";
import ContextProvider from "@/ContextProvider";

// let's set the context up here:
/// now...let's try to make the context NOT an array...(can always take old stufff from github)
////export const MyContext = React.createContext([]);





const Header = () => {

  // now a variable to USE for the context (regarding the click of the profile button)
  /// Q: could we also pass the USER into it? But maybe we are not able to do multiple values?
  const [profileButtonClicked, setProfileButtonClicked] = useContext(MyContext);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn('Supabase auth not available:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
      }
    } catch (error) {
      toast.error("Authentication service not available");
    }
  };

  const handleProfileClick = () => {
    // in here, we will need to set the context for the "profileButtonClicked" (sending it over to the main page)

    setProfileButtonClicked(!profileButtonClicked);

    console.log("Profile button clicked in the header: ");
    console.log(profileButtonClicked);

    // issue: what do we put inside of the context provider??
    /// oh, ok: we need to put the child component inside of it (which in this case is teh main page, index.tsx)

    // issue with the context not working. Is it the WAY teh context is being returned? i.e. there's not a separate class for context provision?
    // so what we could maybe do: create a separte class to provide this context, and then it will just work in index?
    
    // now that we've provided the context, we can go onto trying to receive it (along with the user) in Index.tsx
    
    

  }

  if (isLoading) {
    return (
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Test Duel</span>
          </Link>
          <div className="flex gap-2">
            <div className="w-20 h-10 bg-muted animate-pulse rounded-md"></div>
            <div className="w-20 h-10 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </header>
    );
  }

  return (

    // maybe we can place the context return inside here... (nope...it looks like we need another class)

    <>

    <header className="absolute top-0 left-0 right-0 z-10 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Test Duel</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />

                {/* Wrapping this user email with a profile button */}
                <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProfileClick}
                className="gap-2"
              >
                <span>{user.email}</span>
              </Button>
       
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>

    </>
  );
};

export default Header;