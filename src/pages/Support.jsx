import React from 'react';
import { motion } from 'framer-motion';
import SupportHeader from '@/components/support/SupportHeader';
import FaqSection from '@/components/support/FaqSection';
import ContactForm from '@/components/support/ContactForm';
import AdditionalResources from '@/components/support/AdditionalResources';
import CommunityLinks from '@/components/support/CommunityLinks';
import { HelpCircle } from 'lucide-react';

const Support = () => {
  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <HelpCircle className="w-10 h-10 mr-3 text-cyan-400" />
          Support Center
        </h1>
        <p className="text-xl text-gray-400">
          We're here to help! Find answers or get in touch with our team.
        </p>
      </motion.div>

      <SupportHeader />

      <div className="grid lg:grid-cols-2 gap-8">
        <FaqSection />
        <ContactForm />
      </div>
      
      <AdditionalResources />
      <CommunityLinks />
    </div>
  );
};

export default Support;