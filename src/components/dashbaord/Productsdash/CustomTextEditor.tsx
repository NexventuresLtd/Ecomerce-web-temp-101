// CustomTextEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bold, Italic, List, Underline, Link, Clipboard, Check } from 'lucide-react';

interface CustomTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

const CustomTextEditor: React.FC<CustomTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your text here...',
  disabled = false,
  loading = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [pasteStatus, setPasteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  // Reset paste status after showing
  useEffect(() => {
    if (pasteStatus !== 'idle') {
      const timer = setTimeout(() => setPasteStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [pasteStatus]);

  const formatText = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newValue = value;
    
    if (selectedText) {
      // Wrap selected text
      newValue = 
        value.substring(0, start) + 
        prefix + selectedText + suffix + 
        value.substring(end);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length + selectedText.length;
        textarea.focus();
      }, 0);
    } else {
      // Insert formatting at cursor position
      newValue = 
        value.substring(0, start) + 
        prefix + suffix + 
        value.substring(end);
      
      // Set cursor position between prefix and suffix
      setTimeout(() => {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length;
        textarea.focus();
      }, 0);
    }
    
    onChange(newValue);
  };

  const addBulletPoint = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get current line
    const textBeforeCursor = value.substring(0, start);
    const lastNewLine = textBeforeCursor.lastIndexOf('\n');
    const currentLineStart = lastNewLine + 1;
    const currentLine = value.substring(currentLineStart, start);
    
    let newValue = value;
    
    if (currentLine.trim().startsWith('• ') || currentLine.trim().startsWith('- ')) {
      // Remove bullet point if already exists
      const bulletIndex = currentLine.search(/[•\-]\s/);
      if (bulletIndex !== -1) {
        newValue = 
          value.substring(0, currentLineStart + bulletIndex) + 
          value.substring(currentLineStart + bulletIndex + 2);
        
        // Adjust cursor position
        setTimeout(() => {
          textarea.selectionStart = start - 2;
          textarea.selectionEnd = end - 2;
          textarea.focus();
        }, 0);
      }
    } else {
      // Add bullet point
      const bullet = '• ';
      newValue = 
        value.substring(0, currentLineStart) + 
        bullet + 
        value.substring(currentLineStart);
      
      // Adjust cursor position
      setTimeout(() => {
        textarea.selectionStart = start + bullet.length;
        textarea.selectionEnd = end + bullet.length;
        textarea.focus();
      }, 0);
    }
    
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const pastedText = e.clipboardData.getData('text');
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Process the pasted text
    const processedText = processPastedText(pastedText);
    
    // Insert the processed text
    const newValue = 
      value.substring(0, start) + 
      processedText + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the pasted text
    setTimeout(() => {
      textarea.selectionStart = start + processedText.length;
      textarea.selectionEnd = start + processedText.length;
      textarea.focus();
    }, 0);
    
    setPasteStatus('success');
  };

  const processPastedText = (text: string): string => {
    // Convert various bullet characters to our standard bullet
    let processed = text
      // Convert different bullet characters to •
      .replace(/[•·◦]/g, '•')
      // Convert numbered lists with dots to bullets
      .replace(/^\d+\.\s/gm, '• ')
      // Convert asterisk bullets
      .replace(/^\*\s/gm, '• ')
      // Convert hyphen bullets
      .replace(/^-\s/gm, '• ')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n\n')
      // Trim each line
      .split('\n')
      .map(line => line.trim())
      .join('\n');

    return processed;
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        // Fallback for browsers that don't support clipboard API
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          document.execCommand('paste');
        }
        return;
      }

      const clipboardText = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const processedText = processPastedText(clipboardText);
      
      const newValue = 
        value.substring(0, start) + 
        processedText + 
        value.substring(end);
      
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = start + processedText.length;
        textarea.selectionEnd = start + processedText.length;
        textarea.focus();
      }, 0);
      
      setPasteStatus('success');
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      setPasteStatus('error');
      
      // Fallback: Focus the textarea and let user paste manually
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Ctrl+V or Cmd+V for custom paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      // We handle paste in the paste event, so we don't need to do anything here
      return;
    }

    if (e.key === 'Enter') {
      // Auto-continue bullet points on new lines
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, start);
      const lastNewLine = textBeforeCursor.lastIndexOf('\n');
      const previousLine = value.substring(lastNewLine + 1, start).trim();

      if (previousLine.startsWith('• ') || previousLine.startsWith('- ')) {
        e.preventDefault();
        const newValue = 
          value.substring(0, start) + 
          '\n• ' + 
          value.substring(start);
        
        onChange(newValue);
        
        // Set cursor after the new bullet
        setTimeout(() => {
          textarea.selectionStart = start + 3;
          textarea.selectionEnd = start + 3;
        }, 0);
      }
    } else if (e.key === 'Backspace') {
      // Handle backspace to remove empty bullet points
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, start);
      
      // Check if we're at the beginning of a bullet point line
      if (textBeforeCursor.endsWith('• ') || textBeforeCursor.endsWith('- ')) {
        const lastNewLine = textBeforeCursor.lastIndexOf('\n');
        const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
        const lineContent = value.substring(lineStart, start);
        
        if (lineContent === '• ' || lineContent === '- ') {
          e.preventDefault();
          // Remove the bullet point line
          const newValue = 
            value.substring(0, lineStart) + 
            value.substring(start);
          
          onChange(newValue);
          
          // Set cursor at the start of the line
          setTimeout(() => {
            textarea.selectionStart = lineStart;
            textarea.selectionEnd = lineStart;
          }, 0);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Add indentation (2 spaces)
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = 
        value.substring(0, start) + 
        '  ' + 
        value.substring(end);
      
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    
    const droppedText = e.dataTransfer.getData('text');
    if (!droppedText) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const processedText = processPastedText(droppedText);
    
    const newValue = 
      value.substring(0, start) + 
      processedText + 
      value.substring(end);
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.selectionStart = start + processedText.length;
      textarea.selectionEnd = start + processedText.length;
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      tooltip: 'Bold',
      action: () => formatText('**', '**')
    },
    {
      icon: Italic,
      tooltip: 'Italic',
      action: () => formatText('*', '*')
    },
    {
      icon: Underline,
      tooltip: 'Underline',
      action: () => formatText('<u>', '</u>')
    },
    {
      icon: List,
      tooltip: 'Bullet Point',
      action: addBulletPoint
    },
    {
      icon: Link,
      tooltip: 'Add Link',
      action: () => {
        const url = prompt('Enter URL:');
        if (url) {
          formatText(`[`, `](${url})`);
        }
      }
    },
    {
      icon: pasteStatus === 'success' ? Check : Clipboard,
      tooltip: 'Paste from Clipboard',
      action: handlePasteFromClipboard,
      variant: pasteStatus === 'success' ? 'success' : pasteStatus === 'error' ? 'error' : 'default'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-gray-300 rounded-lg bg-white transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary/20 border-primary' : 'hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon;
          const variant = (button.variant || 'default') as 'default' | 'success' | 'error';
          
          const variantStyles: Record<'default' | 'success' | 'error', string> = {
            default: 'text-gray-600 hover:text-primary hover:bg-white',
            success: 'text-green-600 bg-green-50 hover:bg-green-100',
            error: 'text-red-600 bg-red-50 hover:bg-red-100'
          };

          return (
            <motion.button
              key={index}
              type="button"
              onClick={button.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
              disabled={disabled || loading}
              title={button.tooltip}
            >
              <Icon size={18} />
            </motion.button>
          );
        })}
        
        {/* Character Count */}
        <div className="ml-auto text-xs text-gray-500 font-medium">
          {value.length} characters
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // Allow drop
        placeholder={placeholder}
        disabled={disabled || loading}
        className="w-full px-4 py-3 resize-none border-none focus:outline-none focus:ring-0 min-h-[120px] text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
        style={{ overflow: 'hidden' }}
      />

      {/* Help Text */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-medium">Formatting:</span>
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">**Bold**</kbd>
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">*Italic*</kbd>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Paste Support:</span>
            <span>• Converts bullets automatically</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Shortcuts:</span>
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd>
            <span>for new bullets</span>
            <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Tab</kbd>
            <span>to indent</span>
          </div>
        </div>
        
        {/* Paste Status */}
        <AnimatePresence>
          {pasteStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-2 px-3 py-1 rounded text-xs font-medium ${
                pasteStatus === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {pasteStatus === 'success' 
                ? '✓ Text pasted successfully!' 
                : '✗ Failed to paste. Please use Ctrl+V instead.'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CustomTextEditor;