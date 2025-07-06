import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const SupportHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid md:grid-cols-3 gap-6"
    >
      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Live Chat</h3>
          <p className="text-sm text-gray-400 mb-4">Get instant help from our support team</p>
          <Button 
            className="w-full turquoise-gradient text-black font-semibold"
            onClick={() => toast({
              title: "🚧 Feature Coming Soon!",
              description: "Live chat will be available in the next update. Please use the contact form for now.",
            })}
          >
            Start Chat
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Email Support</h3>
          <p className="text-sm text-gray-400 mb-4">Send us a detailed message</p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-white hover:bg-gray-800"
            onClick={() => window.open('mailto:support@hypehub.social')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            support@hypehub.social
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Community</h3>
          <p className="text-sm text-gray-400 mb-4">Join our Discord or Telegram</p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-white hover:bg-gray-800"
            onClick={() => window.open('https://discord.gg/bJFgn3RH', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Join Discord
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SupportHeader;