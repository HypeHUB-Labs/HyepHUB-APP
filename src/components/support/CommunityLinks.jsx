import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, Github, Twitter, Send, Instagram, MessageSquare, Film, ExternalLink } from 'lucide-react';

const links = [
  { name: 'Docs', url: 'https://hypehub-documentation.gitbook.io/hypehub-documentation/', icon: BookOpen, description: 'Official Documentation' },
  { name: 'Website', url: 'https://hypehub.social/', icon: Globe, description: 'Our Main Website' },
  { name: 'Github', url: 'https://github.com/HypeHUB-Labs', icon: Github, description: 'Source Code & Issues' },
  { name: 'X (Twitter)', url: 'https://x.com/HypeHUB_Social', icon: Twitter, description: 'Latest News & Updates' },
  { name: 'Telegram', url: 'https://t.me/HypeHubPortal', icon: Send, description: 'Community Chat' },
  { name: 'Instagram', url: 'https://www.instagram.com/hypehub_social/', icon: Instagram, description: 'Visual Updates & Stories' },
  { name: 'Discord', url: 'https://discord.gg/bJFgn3RH', icon: MessageSquare, description: 'Join Our Server' },
  { name: 'Tiktok', url: 'https://www.tiktok.com/@hypehub_social', icon: Film, description: 'Short Videos & Fun' },
];

const CommunityLinks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Community & Resources</CardTitle>
          <CardDescription>Connect with us and explore more HypeHUB content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-400/70 transition-all duration-300 h-full flex flex-col justify-between hover-lift">
                      <CardContent className="p-4 text-center flex flex-col items-center justify-center flex-grow">
                        <Icon className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="font-semibold text-white text-md mb-1">{link.name}</h3>
                        <p className="text-xs text-gray-400">{link.description}</p>
                      </CardContent>
                      <div className="p-3 border-t border-gray-700/50">
                         <Button variant="ghost" size="sm" className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                           Visit Link <ExternalLink className="w-3 h-3 ml-1.5" />
                         </Button>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunityLinks;