import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const contactCategories = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'verification', label: 'Task Verification' },
    { value: 'account', label: 'Account Issues' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' }
];

const ContactForm = () => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
    });

    const handleInputChange = (field, value) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            toast({
                title: "❌ Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "🎉 Message Sent!",
            description: "We've received your message and will get back to you within 24 hours.",
        });

        setContactForm({
            name: '',
            email: '',
            subject: '',
            category: 'general',
            message: ''
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
        >
            <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Contact Us</CardTitle>
                    <CardDescription>Send us a message and we'll get back to you soon</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white">Name *</Label>
                                <Input id="name" value={contactForm.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Your name" className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email *</Label>
                                <Input id="email" type="email" value={contactForm.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" className="bg-gray-900 border-gray-700 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-white">Category</Label>
                            <Select value={contactForm.category} onChange={(e) => handleInputChange('category', e.target.value)} className="bg-gray-900 border-gray-700 text-white">
                                {contactCategories.map((category) => (
                                    <option key={category.value} value={category.value}>{category.label}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-white">Subject</Label>
                            <Input id="subject" value={contactForm.subject} onChange={(e) => handleInputChange('subject', e.target.value)} placeholder="Brief description of your issue" className="bg-gray-900 border-gray-700 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-white">Message *</Label>
                            <Textarea id="message" value={contactForm.message} onChange={(e) => handleInputChange('message', e.target.value)} placeholder="Describe your issue or question in detail..." className="bg-gray-900 border-gray-700 text-white min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full h-12 turquoise-gradient text-black font-semibold hover:scale-105 transition-transform">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ContactForm;