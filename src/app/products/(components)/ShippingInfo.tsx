import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShippingInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-auto border-t border-gray-200 pt-4">
      <div className="border border-gray-600 rounded-md overflow-hidden">
        {/* ─────────── Trigger (looks like your <summary>) ─────────── */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center text-md font-medium text-black bg-white px-4 py-2 cursor-pointer transition-colors"
        >
          <span>Shipping Information</span>

          {/* arrow */}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="origin-center"
          >
            ▼
          </motion.span>
        </button>

        {/* ─────────── Animated panel ─────────── */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border border-t-0 p-4 rounded-b-md text-gray-700 text-sm"
            >
              <p>🚚 Standard Shipping: 3–5 business days</p>
              <p>⚡ Express Shipping: 1–2 business days</p>
              <p>🌍 International Shipping: 7–14 business days</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
