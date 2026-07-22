import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface SmsComposeModalProps {
  isOpen: boolean;
  phone: string;
  recipientName: string;
  defaultMessage: string;
  sending: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

const SmsComposeModal: React.FC<SmsComposeModalProps> = ({
  isOpen,
  phone,
  recipientName,
  defaultMessage,
  sending,
  onClose,
  onSend,
}) => {
  const [message, setMessage] = useState(defaultMessage);

  // Reset to the default message whenever a new recipient is opened
  useEffect(() => {
    if (isOpen) setMessage(defaultMessage);
  }, [isOpen, defaultMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Send SMS
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              To {recipientName} • {phone}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Type the SMS message..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} characters
          </p>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(message)}
            disabled={sending || !message.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send SMS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsComposeModal;
