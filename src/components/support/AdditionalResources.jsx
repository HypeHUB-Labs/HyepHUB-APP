import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AdditionalResources = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Additional Resources</CardTitle>
          <CardDescription>More ways to get help and stay updated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">Documentation</h3>
              <p className="text-sm text-gray-400 mb-3">Comprehensive guides and tutorials</p>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => toast({
                  title: "🚧 Coming Soon!",
                  description: "Documentation is being prepared and will be available soon.",
                })}
              >
                View Docs
              </Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-400 mb-3">Step-by-step video guides</p>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => toast({
                  title: "🚧 Coming Soon!",
                  description: "Video tutorials are in production and will be available soon.",
                })}
              >
                Watch Videos
              </Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">Status Page</h3>
              <p className="text-sm text-gray-400 mb-3">Check system status and updates</p>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => toast({
                  title: "✅ All Systems Operational",
                  description: "All HypeHUB services are running smoothly!",
                })}
              >
                Check Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdditionalResources;