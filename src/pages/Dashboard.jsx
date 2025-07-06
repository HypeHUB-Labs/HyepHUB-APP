import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  Star,
  Twitter,
  Youtube,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [userTasks, setUserTasks] = useState([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    tasksCompleted: 0,
    tasksCreated: 0,
    activeFollowers: 0
  });

  useEffect(() => {
    // Load user tasks from localStorage
    const savedTasks = localStorage.getItem('hypehub_user_tasks');
    if (savedTasks) {
      setUserTasks(JSON.parse(savedTasks));
    }

    // Calculate stats
    const savedStats = localStorage.getItem('hypehub_user_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const quickActions = [
    {
      title: "Create Task",
      description: "Post a new social media task",
      icon: Plus,
      link: "/add-task",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Earn Points",
      description: "Complete tasks from others",
      icon: TrendingUp,
      link: "/earn",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Buy Points",
      description: "Purchase points with crypto",
      icon: Star,
      link: "/buy-points",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const recentTasks = userTasks.slice(0, 3);

  const platformIcons = {
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    discord: MessageCircle,
    telegram: MessageCircle,
    reddit: MessageCircle
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 🚀
          </h1>
          <p className="text-gray-400">
            Ready to earn some points today? Let's get hyped!
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Your Balance</p>
              <p className="text-2xl font-bold text-gradient">{user?.points || 0} Points</p>
            </div>
            <div className="w-12 h-12 rounded-full turquoise-gradient flex items-center justify-center pulse-glow">
              <Star className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Points Earned", value: stats.totalEarned, icon: TrendingUp, color: "text-green-400" },
          { label: "Tasks Completed", value: stats.tasksCompleted, icon: CheckCircle, color: "text-blue-400" },
          { label: "Tasks Created", value: stats.tasksCreated, icon: Plus, color: "text-purple-400" },
          { label: "Active Followers", value: stats.activeFollowers, icon: Users, color: "text-pink-400" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.title} to={action.link}>
              <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Recent Tasks</h2>
          <Link to="/add-task">
            <Button className="turquoise-gradient text-black font-semibold hover:scale-105 transition-transform">
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="grid gap-4">
            {recentTasks.map((task, index) => {
              const PlatformIcon = platformIcons[task.platform] || MessageCircle;
              return (
                <Card key={task.id} className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <PlatformIcon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{task.title}</h3>
                          <p className="text-sm text-gray-400">{task.platform} • {task.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-semibold">{task.reward} points</p>
                        <p className="text-sm text-gray-400 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.completions || 0} completed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
            <CardContent className="p-12 text-center">
              <Plus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tasks yet</h3>
              <p className="text-gray-400 mb-6">Create your first task to start earning points!</p>
              <Link to="/add-task">
                <Button className="turquoise-gradient text-black font-semibold">
                  Create Your First Task
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;