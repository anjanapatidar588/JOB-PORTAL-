import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold">Job Hunt</h2>
          <p className="text-sm text-gray-500">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500">
          <Facebook
            className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          />
          <Twitter
            className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          />
          <Linkedin
            className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          />
        </div>

      </div>
    </footer>
  );
};

export default Footer;
