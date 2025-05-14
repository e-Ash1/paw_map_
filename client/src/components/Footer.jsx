import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="w-full bg-gray-900 text-white py-4 text-center shadow-lg mt-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginTop: "auto" }} 
    >
      <p className="text-sm md:text-base font-light tracking-wide">
        © {new Date().getFullYear()} Pet Resource Finder. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
