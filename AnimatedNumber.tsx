"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: string;
  className?: string;
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsUpdating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: 0 }}
      animate={isUpdating ? { opacity: 0.5, y: -4 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {displayValue}
    </motion.div>
  );
};
