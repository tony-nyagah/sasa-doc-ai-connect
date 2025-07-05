import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SasaDoc from "./pages/SasaDoc";
import SymptomsChecker from "./pages/SymptomsChecker";
import SelfCareGuide from "./pages/SelfCareGuide";
import AppointmentBooking from "./pages/AppointmentBooking";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sasadoc" element={<SasaDoc />} />
            <Route path="/sasadoc/symptoms-checker" element={<SymptomsChecker />} />
            <Route path="/sasadoc/self-care" element={<SelfCareGuide />} />
            <Route path="/sasadoc/appointment-booking" element={<AppointmentBooking />} />
            <Route path="/community" element={<Community />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;