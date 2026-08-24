import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';

const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

// Shown to plain "admin" accounts — the full stats/notifications dashboard,
// user management, and transactions are all reserved for the super admin.
// This admin only gets to see total revenue.
const RestrictedOverview = () => {
    const [revenue, setRevenue] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        mainAxios.get('/dashboard/revenue-summary')
            .then(res => setRevenue(res.data?.total_revenue ?? 0))
            .catch(err => setError(getAdminErrorMessage(err, 'Failed to load revenue')))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {loading ? '...' : error ? '—' : RWF.format(revenue || 0)}
                        </p>
                    </div>
                </div>
                {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </div>
        </div>
    );
};

export default RestrictedOverview;
