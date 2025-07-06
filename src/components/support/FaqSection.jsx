import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
    {
      id: 1,
      question: "How do I earn points on HypeHUB?",
      answer: "You can earn points by completing social media tasks posted by other users. Simply browse the 'Earn Points' section, find tasks you want to complete, and follow the instructions. Once verified, you'll receive the reward points instantly."
    },
    {
      id: 2,
      question: "How do I create a task?",
      answer: "Go to the 'Add Task' section, choose your platform (Twitter, YouTube, Instagram, etc.), fill in the task details, set your reward amount, and submit. Your task will be visible to other users who can complete it for the points you've allocated."
    },
    {
      id: 3,
      question: "How are tasks verified?",
      answer: "Our system automatically verifies most social media actions through API integrations and smart contracts. For complex tasks, we use a combination of automated checks and community verification to ensure fairness."
    },
    {
      id: 4,
      question: "Can I withdraw my points as cryptocurrency?",
      answer: "Yes! Points can be converted to our native token and withdrawn to your connected wallet. The conversion rate and minimum withdrawal amounts are displayed in your dashboard."
    },
    {
      id: 5,
      question: "What happens if someone doesn't complete my task properly?",
      answer: "If a task completion is disputed or found to be invalid, the points are returned to your account and the user receives a warning. Repeated violations can result in account suspension."
    },
];

const FaqSection = () => {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleFaqToggle = (faqId) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
    };

    return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 pt-0 text-gray-400 border-t border-gray-700">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
    );
};

export default FaqSection;