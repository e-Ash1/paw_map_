import React from "react";
import { motion } from "framer-motion";

const DirectionsPanel = ({
  steps = [],
  isOpen,
  onClose,
  onStepHover,
  activeStepIndex,
  onStepClick,
  slideFrom = 'bottom',
}) => {
  return (
    <motion.div
      className="fixed left-0 bottom-0 w-full h-1/3 bg-white shadow-2xl z-50 p-6 rounded-t-2xl overflow-y-auto focus:outline-none focus:ring-4 focus:ring-green-200"
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      exit="exit"
      variants={{
        hidden: slideFrom === 'bottom' ? { y: '100%' } : { x: '100%' },
        visible: slideFrom === 'bottom' ? { y: 0 } : { x: 0 },
        exit: slideFrom === 'bottom' ? { y: '100%' } : { x: '100%' },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button
        onClick={onClose}
        className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Close
      </button>
      <ol className="space-y-2">
        {steps.map((item, idx) => {
          // Determines the display text: if item is string, use directly; if object, use property 'instructions' or 'text'
          const text =
            typeof item === 'string'
              ? item
              : item.instructions || item.text || JSON.stringify(item);
          return (
            <li
              key={idx}
              onMouseEnter={() => onStepHover(idx)}
              onClick={() => onStepClick(idx)}
              className={`cursor-pointer text-sm transition-colors ${
                activeStepIndex === idx
                  ? 'text-green-600 font-semibold'
                  : 'text-gray-700 hover:text-green-500'
              }`}
            >
              {text}
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
};

export default DirectionsPanel;
