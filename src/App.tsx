import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "@/Home";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { Terms } from "@/pages/Terms";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { Auth } from "@/pages/Auth";
import Admin from "@/pages/Admin";
import { AdminPostEditor } from "@/pages/AdminPostEditor";
import { NotFound } from "@/pages/NotFound";
import { Banned } from "@/pages/Banned";
import { ServerError } from "@/pages/ServerError";
import { AboutMe } from "@/pages/AboutMe";
import { Projects } from "@/pages/Projects";
import { ProjectManagement } from "@/pages/ProjectManagement";
import { UserProfile } from "@/pages/UserProfile";
import { ErrorPage } from "@/pages/ErrorPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initGA, sendPageView } from "@/lib/ga";
import { trackPageView } from "@/lib/analytics";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" theme="dark" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    // Track GA4 and Supabase analytics on route changes
    sendPageView(location.pathname);
    trackPageView({
      page_path: location.pathname,
      page_title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutMe />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/manage" element={<ProjectManagement />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/posts/new" element={<AdminPostEditor />} />
      <Route path="/admin/posts/edit/:slug" element={<AdminPostEditor />} />
      <Route path="/profile/:username" element={<UserProfile />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/banned" element={<Banned />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};