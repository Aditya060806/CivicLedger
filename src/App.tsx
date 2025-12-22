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
import { EnhancedAIChatbot } from "@/components/common/EnhancedAIChatbot";
import { AnimatePresence } from "framer-motion";
import { Home } from "./pages/Home";
import { EnhancedDashboard } from "./components/common/EnhancedDashboard";
import { EnhancedCitizenPortal } from "./components/common/EnhancedCitizenPortal";
import { EnhancedDAOVoting } from "./components/common/EnhancedDAOVoting";
import { EnhancedPolicyMaker } from "./components/common/EnhancedPolicyMaker";
import { AuditorPanel } from "./pages/AuditorPanel";
import { ContractorView } from "./pages/ContractorView";
import { CitizenReport } from "./pages/CitizenReport";
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
        // Service is auto-initialized in constructor
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
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/citizen" element={<EnhancedCitizenPortal />} />
            <Route path="/voting" element={<EnhancedDAOVoting />} />
            <Route path="/policy-maker" element={<EnhancedPolicyMaker />} />
            <Route path="/auditor" element={<AuditorPanel />} />
            <Route path="/contractor" element={<ContractorView />} />
            <Route path="/report" element={<CitizenReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <FloatingReportButton />
        <EnhancedAIChatbot />
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
