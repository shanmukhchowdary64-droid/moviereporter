import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Celebrities from "./pages/Celebrities";
import News from "./pages/News";
import Blogs from "./pages/Blogs";
import Polls from "./pages/Polls";
import Login from "./pages/Login";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/celebrities" element={<Celebrities />} />
          <Route path="/news" element={<News />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          {/* Placeholder routes */}
          <Route path="/movies-info" element={<Movies />} />
          <Route path="/top-box-office" element={<Movies />} />
          <Route path="/upcoming-releases" element={<Movies />} />
          <Route path="/ott-releases" element={<Movies />} />
          <Route path="/weekly-magazine" element={<News />} />
          <Route path="/vote-enroll" element={<Polls />} />
          <Route path="/award-winners" element={<Polls />} />
          <Route path="/help" element={<About />} />
          <Route path="/promotion" element={<About />} />
          <Route path="/copyright" element={<About />} />
          <Route path="/profile" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
