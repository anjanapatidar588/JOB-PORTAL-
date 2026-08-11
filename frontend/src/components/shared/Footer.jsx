import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import hireflowLogo from "@/assets/hireflow-logo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <img src={hireflowLogo} alt="HireFlow Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            © 2026 HireFlow. All rights reserved. Connecting talent with top opportunities.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-slate-400">
          <Facebook
            className="w-5 h-5 cursor-pointer hover:text-brand-600 transition-colors duration-200"
          />
          <Twitter
            className="w-5 h-5 cursor-pointer hover:text-brand-600 transition-colors duration-200"
          />
          <Linkedin
            className="w-5 h-5 cursor-pointer hover:text-brand-600 transition-colors duration-200"
          />
        </div>

      </div>
    </footer>
  );
};

export default Footer;

