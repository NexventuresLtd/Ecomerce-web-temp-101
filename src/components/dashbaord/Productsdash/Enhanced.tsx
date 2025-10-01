// EnhancedTextEditor.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';
import CustomTextEditor from './CustomTextEditor';

interface EnhancedTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  required?: boolean;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your text here...',
  disabled = false,
  loading = false,
  label = 'Description',
  required = false
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  // Simple markdown parser for preview
  const parseMarkdown = (text: string) => {
    return text
      // Bold: **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline: <u>text</u>
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Links: [text](url)
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
      // Bullet points
      .replace(/^[•\-]\s(.*)$/gm, '<li>$1</li>')
      // Convert line breaks
      .replace(/\n/g, '<br>')
      // Wrap bullet points in ul
      .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1">$1</ul>')
      // Remove extra ul wrappers
      .replace(/<\/ul><br><ul/g, '</ul><ul')
      .replace(/<ul><\/ul>/g, '');
  };

  const previewHtml = parseMarkdown(value);

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              previewMode 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={disabled || loading}
          >
            {previewMode ? (
              <>
                <EyeOff size={16} />
                Edit
              </>
            ) : (
              <>
                <Eye size={16} />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <AnimatePresence mode="wait">
        {previewMode ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[120px] p-4 border border-gray-300 rounded-lg bg-white prose prose-sm w-full"
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p className="text-gray-400 italic">{placeholder}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CustomTextEditor
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Formatting Tips:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <Check size={12} className="text-blue-600 flex-shrink-0" />
            <span>Use <code>**bold**</code> for bold text</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-blue-600 flex-shrink-0" />
            <span>Use <code>*italic*</code> for italic text</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-blue-600 flex-shrink-0" />
            <span>Click bullet button or type <code>•</code> for lists</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={12} className="text-blue-600 flex-shrink-0" />
            <span>Press <kbd className="px-1 bg-blue-100 rounded">Enter</kbd> to continue bullets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTextEditor;