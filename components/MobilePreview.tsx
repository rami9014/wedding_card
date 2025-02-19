import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobilePreview({
  isOpen,
  onClose,
  children,
}: MobilePreviewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-[3rem] overflow-hidden"
            style={{
              width: "375px",
              height: "812px",
            }}
          >
            {/* 모바일 상태바 */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full" />
            </div>

            {/* 컨텐츠 */}
            <div className="w-full h-full overflow-y-auto">{children}</div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-8 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
