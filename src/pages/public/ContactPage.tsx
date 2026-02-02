import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Github,
    Twitter,
    Linkedin,
    Send,
    HelpCircle,
    MessageCircle,
    ArrowRight
} from 'lucide-react';

export const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-24 pb-20">
            <section className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-text-primary">
                            Get in <span className="text-primary italic">Touch.</span>
                        </h1>
                        <p className="text-xl text-text-secondary">
                            Whether you have a question about our courses, pricing, or just want to say hi, our team is ready to help.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass-card p-10 rounded-[2.5rem] space-y-8">
                            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Email us</p>
                                        <p className="text-lg font-bold">hello@placeiq.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Call us</p>
                                        <p className="text-lg font-bold">+1 (555) 000-0000</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Visit us</p>
                                        <p className="text-lg font-bold">123 Creator Avenue, Innovation District, Tech City 94000</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-black/5">
                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 text-center">Follow our journey</p>
                                <div className="flex justify-center gap-6">
                                    {[
                                        { icon: <Github className="w-5 h-5" />, href: '#' },
                                        { icon: <Twitter className="w-5 h-5" />, href: '#' },
                                        { icon: <Linkedin className="w-5 h-5" />, href: '#' },
                                        { icon: <MessageCircle className="w-5 h-5" />, href: '#' }
                                    ].map((social, i) => (
                                        <a key={i} href={social.href} className="w-10 h-10 glass-card flex items-center justify-center rounded-xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-[2rem] border-accent/10">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <HelpCircle className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Check out our Help Desk</h3>
                                    <p className="text-sm text-text-secondary">Find quick answers to common questions.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-panel p-10 md:p-16 rounded-[3rem]">
                            <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Send us a <span className="text-primary">Message</span></h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold px-1">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Jane"
                                            className="w-full px-6 py-4 bg-white/50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold px-1">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full px-6 py-4 bg-white/50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="jane@example.com"
                                        className="w-full px-6 py-4 bg-white/50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Subject</label>
                                    <select className="w-full px-6 py-4 bg-white/50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Course Support</option>
                                        <option>Business Partnership</option>
                                        <option>Mentor Program</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold px-1">Message</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Tell us what you need help with..."
                                        className="w-full px-6 py-4 bg-white/50 border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:gap-5 transition-all shadow-lg shadow-primary/30"
                                >
                                    Send Message <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="container mx-auto px-4 mt-32">
                <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked <span className="text-accent italic">Questions</span></h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            q: "Is the platform free for students?",
                            a: "We offer both free resources and premium career tracks. You can start learning for free today!"
                        },
                        {
                            q: "How do I become a mentor?",
                            a: "You can apply through our Mentor Portal. We look for professionals with at least 3 years of industry experience."
                        },
                        {
                            q: "Can I get a refund if I'm not satisfied?",
                            a: "Yes, we offer a 7-day money-back guarantee for all our premium career tracks."
                        },
                        {
                            q: "Are the certificates industry-recognized?",
                            a: "Absolutely! Our certificates are co-branded with our hiring partners and recognized by leading tech companies."
                        }
                    ].map((faq, i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl">
                            <h3 className="font-bold mb-3 flex items-start gap-3">
                                <span className="text-primary">Q:</span> {faq.q}
                            </h3>
                            <p className="text-text-secondary text-sm ml-7">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button className="text-primary font-bold inline-flex items-center gap-2 hover:underline">
                        View All FAQs <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>
        </div>
    );
};
