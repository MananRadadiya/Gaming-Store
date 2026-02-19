import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gamepad2, Twitter, Youtube, Instagram, Twitch, Github, ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitch, href: '#', label: 'Twitch' },
  { icon: Github, href: '#', label: 'GitHub' },
];

const footerSections = {
  Products: [
    { label: 'Gaming Mice', to: '/store' },
    { label: 'Keyboards', to: '/store' },
    { label: 'Headsets', to: '/store' },
    { label: 'Monitors', to: '/store' },
    { label: 'Graphics Cards', to: '/store' },
  ],
  Support: [
    { label: 'Contact Us', to: '#' },
    { label: 'FAQ', to: '#' },
    { label: 'Shipping Info', to: '#' },
    { label: 'Returns', to: '#' },
    { label: 'Warranty', to: '#' },
  ],
  Company: [
    { label: 'About', to: '#' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '#' },
    { label: 'Esports', to: '/esports' },
    { label: 'Press', to: '#' },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030303] border-t border-white/[0.04] overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00FF88] to-[#00E0FF] rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-shadow duration-300">
                <Gamepad2 size={18} className="text-[#050505]" />
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                NEXUS
              </span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-8">
              Elite gaming hardware for champions. Precision-engineered peripherals trusted by pro gamers worldwide.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-[#00FF88] hover:border-[#00FF88]/20 hover:bg-[#00FF88]/5 transition-all duration-300"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerSections).map(([title, items], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * (idx + 1) }}
              className="lg:col-span-2"
            >
              <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-5">{title}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-1 text-sm text-white/30 hover:text-white transition-colors duration-300"
                    >
                      {item.label}
                      <ArrowUpRight size={11} className="opacity-0 -translate-y-0.5 group-hover:opacity-50 group-hover:translate-y-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-white/15 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/30">San Francisco, CA United States</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-white/15 flex-shrink-0" />
                <a href="mailto:hello@nexus.gg" className="text-sm text-white/30 hover:text-white transition-colors">hello@nexus.gg</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-white/15 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-white/30 hover:text-white transition-colors">+1 (234) 567-890</a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/15 text-xs">
            &copy; {currentYear} NEXUS Gaming Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/15 text-xs hover:text-white/40 transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
