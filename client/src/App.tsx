import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import NotFound from "@/pages/not-found";

import Legal from "@/pages/Legal"; // Import Legal page

import Admin from "@/pages/Admin";
import Brands from "@/pages/Brands";
import AuthPage from "@/pages/AuthPage";
import Cart from "@/pages/Cart";
import NewArrivals from "@/pages/NewArrivals";
import Motorcycles from "@/pages/Motorcycles";
import MotorcycleDetail from "@/pages/MotorcycleDetail";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-black dark:text-gray-100 transition-colors duration-300">
      <TopBar />
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/new-arrivals" component={NewArrivals} />
          <Route path="/motorcycles" component={Motorcycles} />
          <Route path="/motorcycles/:id" component={MotorcycleDetail} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogDetail} />
          <Route path="/about" component={About} />
          <Route path="/legal/:section?" component={Legal} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/cart" component={Cart} />
          <Route path="/admin" component={Admin} />
          <Route path="/brands" component={Brands} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
