import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/common/PageLoader";
import { Layout } from "@/components/layout/Layout";
import { FloatingReportButton } from "@/components/common/FloatingReportButton";
import { AIChatbot } from "@/components/common/AIChatbot";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { CitizenPortal } from "./pages/CitizenPortal";
import { DAOVoting } from "./pages/DAOVoting";
import { PolicyMaker } from "./pages/PolicyMaker";
import { AuditorPanel } from "./pages/AuditorPanel";
import { ContractorView } from "./pages/ContractorView";
import { CitizenReport } from "./pages/CitizenReport";

import { WCHL25Dashboard } from "./components/dashboard/WCHL25Dashboard";
import EnhancedWCHL25Dashboard from "./components/dashboard/EnhancedWCHL25Dashboard";
import NotFound from "./pages/NotFound";
import { enhancedICPService } from "./lib/enhancedICPService";

const queryClient = new QueryClient();

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const location = useLocation();

  // Initialize enhanced ICP service
  useEffect(() => {
    const initializeEnhancedICP = async () => {
      try {
        console.log("🚀 Initializing Enhanced ICP Service...");
        await enhancedICPService.initializeBlockchainConnection();
        await enhancedICPService.setupBlockchainMonitoring();
        console.log("✅ Enhanced ICP Service initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Enhanced ICP Service:", error);
      }
    };

    initializeEnhancedICP();
  }, []);

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Route change loading
  useEffect(() => {
    if (!isLoading) {
      setRouteLoading(true);
      const timer = setTimeout(() => {
        setRouteLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading]);

  return (
    <>
      <PageLoader 
        isLoading={isLoading || routeLoading} 
        onComplete={() => {
          setIsLoading(false);
          setRouteLoading(false);
        }} 
      />
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/voting" element={<DAOVoting />} />
            <Route path="/policy-maker" element={<PolicyMaker />} />
            <Route path="/auditor" element={<AuditorPanel />} />
            <Route path="/contractor" element={<ContractorView />} />
            <Route path="/report" element={<CitizenReport />} />
            
            <Route path="/wchl25-dashboard" element={<WCHL25Dashboard />} />
            <Route path="/enhanced-wchl25-dashboard" element={<EnhancedWCHL25Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <FloatingReportButton />
        <AIChatbot />
      </Layout>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
