import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence } from 'framer-motion';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EarnPoints from '@/pages/EarnPoints';
import AddTask from '@/pages/AddTask';
import Notifications from '@/pages/Notifications';
import BuyPoints from '@/pages/BuyPoints';
import Support from '@/pages/Support';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  const protectedLayout = (Page) => (
    <ProtectedRoute>
      <Layout>
        <Page />
      </Layout>
    </ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={protectedLayout(Dashboard)} />
        <Route path="/earn" element={protectedLayout(EarnPoints)} />
        <Route path="/add-task" element={protectedLayout(AddTask)} />
        <Route path="/notifications" element={protectedLayout(Notifications)} />
        <Route path="/buy-points" element={protectedLayout(BuyPoints)} />
        <Route path="/support" element={protectedLayout(Support)} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen gradient-bg">
          <AnimatedRoutes />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;