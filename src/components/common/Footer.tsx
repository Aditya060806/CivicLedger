import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Github, 
  Linkedin,
  Heart,
  ExternalLink,
  FileText,
  Lock,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "DAO Voting", href: "/voting" },
        { name: "Citizen Portal", href: "/citizen" },
        { name: "Policy Maker", href: "/policy-maker" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#", external: true },
        { name: "API Reference", href: "#", external: true },
        { name: "Smart Contracts", href: "#", external: true },
        { name: "Audit Reports", href: "/auditor" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Compliance", href: "#" },
        { name: "Transparency Report", href: "#" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/civilledger", label: "Twitter" },
    { icon: Github, href: "https://github.com/civilledger", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/civilledger", label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@civilledger.gov.in", href: "mailto:contact@civilledger.gov.in" },
    { icon: Phone, text: "+91 11 2345 6789", href: "tel:+911123456789" },
    { icon: MapPin, text: "New Delhi, India", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-civic-gray-50 border-t border-civic-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-civic rounded-xl flex items-center justify-center shadow-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-foreground">CivilLedger</span>
                  <p className="text-xs text-civic-slate">Governance That Executes Itself</p>
                </div>
              </Link>
              
              <p className="text-sm text-civic-slate leading-relaxed max-w-md">
                Transforming government policies into transparent smart contracts for accountable, 
                automated governance. Built with blockchain technology for complete transparency 
                and citizen empowerment.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center space-x-4 text-xs text-civic-slate">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4 text-civic-green" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-civic-blue" />
                  <span>Government Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Scale className="w-4 h-4 text-civic-purple" />
                  <span>Audited & Compliant</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-civic-slate hover:text-civic-blue transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      {link.external && (
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Contact & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-foreground text-sm">Contact Information</h3>
            <div className="space-y-3">
              {contactInfo.map((contact) => (
                <a
                  key={contact.text}
                  href={contact.href}
                  className="flex items-center space-x-3 text-sm text-civic-slate hover:text-civic-blue transition-colors group"
                >
                  <contact.icon className="w-4 h-4 text-civic-blue group-hover:scale-110 transition-transform" />
                  <span>{contact.text}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-foreground text-sm">Stay Connected</h3>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-10 h-10 hover:bg-civic-blue hover:text-white hover:border-civic-blue transition-all duration-200"
                >
                  <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-civic-slate">
              Follow us for updates on platform development, policy implementations, 
              and governance transparency initiatives.
            </p>
          </motion.div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-6 text-xs text-civic-slate">
            <span>© 2024 CivilLedger. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-civic-red" />
              <span>for transparent governance</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-civic-slate">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-civic-green rounded-full animate-pulse" />
              <span>System Status: All Services Operational</span>
            </div>
            <Link 
              to="/dashboard" 
              className="text-civic-blue hover:text-civic-blue-dark transition-colors"
            >
              <FileText className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};