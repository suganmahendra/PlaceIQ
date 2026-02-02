
import { Link } from 'react-router-dom';
import { BrainCircuit, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <BrainCircuit className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PlaceIQ</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            AI-powered placement intelligence platform helping students gets job-ready with smart learning paths and analytics.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/learning-preview" className="hover:text-primary transition-colors">Learning Paths</Link></li>
                            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2026 PlaceIQ. All rights reserved.</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        Made with <span className="text-red-500">♥</span> for Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
