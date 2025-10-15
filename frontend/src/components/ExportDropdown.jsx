import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportDropdown = ({ exportToExcel, exportToPDF }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* الزر الرئيسي */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        <span>Export</span>
        <ChevronDown size={18} />
      </button>

      {/* القائمة المنسدلة مع الحركة */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => {
                exportToPDF();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <FileText size={16} className="mr-2 text-red-600" />
              Export PDF
            </button>

            <button
              onClick={() => {
                exportToExcel();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <FileSpreadsheet size={16} className="mr-2 text-green-600" />
              Export Excel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportDropdown;
