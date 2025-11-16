import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { TestDuel } from "./pages/TestDuel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

import React, {useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Header from '@/components/ui/header';

const queryClient = new QueryClient();

export const MyContext = React.createContext([]);

const App = () => {
  {/* Adding the context in here, copying over from the context provider class*/}

  {/* Before adding the context, we have to try to convert the app to a regular function... */}

  const [profileButtonClicked, setProfileButtonClicked] = useState(false); 

  return (

    <>

    {/* Let's test a simple paragraph */}
    

    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />


      

      <BrowserRouter>
        
        <MyContext.Provider value={[profileButtonClicked, setProfileButtonClicked]}>
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/duel" element={<TestDuel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Test route for the profile page*/}
          <Route path="/profile" element={<Profile />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        </MyContext.Provider>

       
        

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

  



  </>
  )
  
};

export default App;
