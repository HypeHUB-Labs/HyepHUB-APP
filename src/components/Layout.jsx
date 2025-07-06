import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Coins, 
  Plus, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Wallet,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/earn', icon: Coins, label: 'Earn Points' },
    { path: '/add-task', icon: Plus, label: 'Add Task' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/buy-points', icon: CreditCard, label: 'Buy Points' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
  ];

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/50 backdrop-blur-lg border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9db790c3-2ee2-41a0-9191-81221157511a/af0fd1abab4892bfa30dfcd68afb8e93.png" alt="HypeHUB Logo" className="h-8" />
            <h1 className="text-2xl font-bold text-gradient">HypeHUB</h1>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full turquoise-gradient flex items-center justify-center">
              {user?.type === 'wallet' ? <Wallet className="w-5 h-5 text-black" /> : <Mail className="w-5 h-5 text-black" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.type === 'wallet' 
                  ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
                  : user?.email
                }
              </p>
              <p className="text-cyan-400 text-sm font-semibold">{user?.points || 0} Points</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover-lift ${
                      isActive 
                        ? 'turquoise-gradient text-black font-semibold' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
      
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="bg-black/60 fixed inset-0 z-30 lg:hidden"
        />
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 lg:hidden flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-white" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
             <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9db790c3-2ee2-41a0-9191-81221157511a/af0fd1abab4892bfa30dfcd68afb8e93.png" alt="HypeHUB Logo" className="h-7" />
            <h1 className="text-xl font-bold text-gradient">HypeHUB</h1>
          </Link>
          <div className="w-10"></div>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;