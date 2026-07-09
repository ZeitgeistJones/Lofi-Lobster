"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AnimatedNumberProps = {
  value: string;
  className?: string;
};

export const AnimatedNumber = ({ value, className = "" }: AnimatedNumberProps) => {
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
