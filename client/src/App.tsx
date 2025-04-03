import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import BotDemo from "./BotDemo";
import Dashboard from "@/pages/Dashboard";

function Navigation() {
  const [location, setLocation] = useLocation();
  
  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄 Bot</div>
        <div className="flex space-x-4">
          <div 
            className={`cursor-pointer ${location === '/' ? 'text-blue-300' : 'hover:text-blue-300'}`}
            onClick={() => setLocation('/')}
          >
            Bot Demo
          </div>
          <div 
            className={`cursor-pointer ${location === '/dashboard' ? 'text-blue-300' : 'hover:text-blue-300'}`}
            onClick={() => setLocation('/dashboard')}
          >
            Dashboard
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={BotDemo} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
