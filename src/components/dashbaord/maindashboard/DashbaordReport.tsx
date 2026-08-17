import React from 'react';
import { FileText } from 'lucide-react';

const DashboardReport: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Reports</h1>
          <p className="text-sm text-gray-500">Generate and export system performance reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Automated Report Generator</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Export full transaction, inventory, and user activity summaries in PDF/CSV format directly from the main overview.
        </p>
      </div>
    </div>
  );
};

export default DashboardReport;
