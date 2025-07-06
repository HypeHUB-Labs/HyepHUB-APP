import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  Star, 
  Crown, 
  Wallet,
  Check,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const BuyPoints = () => {
  const { user, updateUserPoints } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      points: 1000,
      price: 0.01,
      currency: 'ETH',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      bonus: 0
    },
    {
      id: 'growth',
      name: 'Growth Pack',
      points: 5000,
      price: 0.045,
      currency: 'ETH',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      popular: true,
      bonus: 500
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      points: 10000,
      price: 0.08,
      currency: 'ETH',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      popular: false,
      bonus: 1500
    },
    {
      id: 'elite',
      name: 'Elite Pack',
      points: 25000,
      price: 0.18,
      currency: 'ETH',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      popular: false,
      bonus: 5000
    }
  ];

  const handlePurchase = async (pkg) => {
    if (!user) return;

    setLoading(true);
    setSelectedPackage(pkg.id);

    try {
      // Simulate wallet connection and payment
      if (typeof window.ethereum !== 'undefined') {
        toast({
          title: "🔄 Processing Payment...",
          description: "Please confirm the transaction in your wallet.",
        });

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Add points to user account
        const totalPoints = pkg.points + pkg.bonus;
        updateUserPoints(user.points + totalPoints);

        toast({
          title: "🎉 Purchase Successful!",
          description: `You received ${totalPoints} points! ${pkg.bonus > 0 ? `(+${pkg.bonus} bonus)` : ''}`,
        });

        // Update user stats
        const currentStats = JSON.parse(localStorage.getItem('hypehub_user_stats') || '{}');
        const updatedStats = {
          ...currentStats,
          totalPurchased: (currentStats.totalPurchased || 0) + totalPoints
        };
        localStorage.setItem('hypehub_user_stats', JSON.stringify(updatedStats));

      } else {
        toast({
          title: "❌ Wallet Not Found",
          description: "Please install MetaMask to make purchases.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Purchase Failed",
        description: "Transaction was cancelled or failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Buy Points 💎
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          Boost your HypeHUB experience with instant points!
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Current Balance</p>
            <p className="text-2xl font-bold text-gradient">{user?.points || 0} Points</p>
          </div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Why Buy Points?</CardTitle>
            <CardDescription>Unlock the full potential of HypeHUB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Create More Tasks</h3>
                <p className="text-sm text-gray-400">Post high-reward tasks to get faster completions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Higher Visibility</h3>
                <p className="text-sm text-gray-400">Tasks with more points rank higher in feeds</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Premium Features</h3>
                <p className="text-sm text-gray-400">Access exclusive features and priority support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Packages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">Choose Your Package</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <Card className={`card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer transition-all ${
                  pkg.popular ? 'ring-2 ring-yellow-400/50' : ''
                } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white">{pkg.name}</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-gradient">{pkg.points.toLocaleString()}</span>
                      {pkg.bonus > 0 && (
                        <span className="text-green-400 text-sm block">+{pkg.bonus} bonus points!</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-white">{pkg.price} {pkg.currency}</p>
                      <p className="text-sm text-gray-400">≈ ${(pkg.price * 2000).toFixed(0)} USD</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm text-gray-400">
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        Instant delivery
                      </div>
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        No expiration
                      </div>
                      {pkg.bonus > 0 && (
                        <div className="flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-400 mr-2" />
                          {pkg.bonus} bonus points
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      disabled={loading}
                      className={`w-full h-12 font-semibold transition-all ${
                        pkg.popular 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105' 
                          : 'turquoise-gradient text-black hover:scale-105'
                      }`}
                    >
                      {loading && isSelected ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Wallet className="w-4 h-4 mr-2" />
                          Buy Now
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Secure & Instant</h3>
                <p className="text-sm text-gray-400">
                  All transactions are processed securely through your connected wallet. 
                  Points are added to your account instantly upon successful payment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuyPoints;