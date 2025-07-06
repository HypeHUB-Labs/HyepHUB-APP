import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Mail, Zap, Users, Trophy, Star, Eye, EyeOff, HelpCircle as LoaderCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "❌ Missing Information",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
    setLoading(false);
  };
  
  const handleWalletConnect = () => {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: "Wallet connection is being finalized. Please use email for now!",
      });
  };

  const features = [
    { icon: Zap, title: "Earn Instantly", desc: "Complete social tasks to earn points." },
    { icon: Users, title: "Grow Your Audience", desc: "Reward others to follow and engage." },
    { icon: Trophy, title: "Claim Real Rewards", desc: "Convert points to crypto or perks." },
  ];

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen w-full login-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="animated-bg">
        <div className="shape1"></div>
        <div className="shape2"></div>
        <div className="shape3"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="mb-8">
            <div className="flex items-center justify-center lg:justify-start mb-4 floating">
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9db790c3-2ee2-41a0-9191-81221157511a/af0fd1abab4892bfa30dfcd68afb8e93.png" alt="HypeHUB Logo" className="h-12 md:h-16" />
              <h1 className="text-5xl md:text-7xl font-black text-gradient py-2 pl-2 md:pl-4">
                HypeHUB
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              The revolutionary platform where your social media engagement earns you real-world value.
            </p>
          </div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="flex items-start md:items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full turquoise-gradient flex items-center justify-center pulse-glow">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="glass-container w-full max-w-md mx-auto"
        >
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'login'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white">
                    {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-400 mt-2">
                    {isSignUp ? 'Join the hype and start earning!' : 'Login to continue your journey.'}
                  </p>
                </div>
                <form onSubmit={handleAuthAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-gray-900/50 border-gray-700 text-white h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-900/50 border-gray-700 text-white h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg font-semibold turquoise-gradient text-black hover-lift hover:scale-105 transition-transform duration-300"
                  >
                    {loading ? (
                      <LoaderCircle className="w-6 h-6 animate-spin" />
                    ) : (isSignUp ? 'Sign Up' : 'Login')}
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="flex-grow h-px bg-gray-700"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="flex-grow h-px bg-gray-700"></div>
                </div>
                
                <Button
                  onClick={handleWalletConnect}
                  variant="outline"
                  className="w-full h-12 border-gray-700 text-white bg-gray-900/50 hover:bg-gray-800 hover-lift"
                >
                  <Wallet className="w-5 h-5 mr-3 text-cyan-400" />
                  Continue with Wallet
                </Button>

                <p className="text-center text-sm text-gray-400 mt-6">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-semibold text-cyan-400 hover:text-cyan-300 ml-1"
                  >
                    {isSignUp ? 'Log In' : 'Sign Up'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;