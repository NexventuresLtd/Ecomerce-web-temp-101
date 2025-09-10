import React, { useState } from 'react';
import {
    Mail,
} from 'lucide-react';
import { useAppContext } from '../../contexts/dashbaord/context';
import Header from '../../components/dashbaord/maindashboard/MainHeader';
import Sidebar from '../../components/dashbaord/maindashboard/MainSidebar';
import CategoriesView from '../../components/dashbaord/maindashboard/categoryManagent';
import ProductManagement from '../../components/dashbaord/Productsdash/MainProducts';
import WishlistAdmin from '../../components/dashbaord/Productsdash/WishlistAdmin';
import CartAdmin from '../../components/dashbaord/Productsdash/CartAdmin';
import Overview from '../../components/dashbaord/maindashboard/overview';



// interface User {
//     id: string;
//     name: string;
//     email: string;
//     role: 'admin' | 'customer';
//     joinDate: string;
// }





// Mock Data
// const mockUsers: User[] = [
//     { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', joinDate: '2024-01-15' },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joinDate: '2024-02-20' },
//     { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', joinDate: '2023-12-01' },
// ];





// Users View
const UsersView: React.FC = () => {
    // const [users, setUsers] = useState<User[]>(mockUsers);
    // setUsers(mock)
    const [showEmailForm, setShowEmailForm] = useState(false);

    const EmailForm = () => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Email to All Users</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Subject"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <textarea
                    placeholder="Message"
                    rows={5}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Send Email
                    </button>
                    <button
                        onClick={() => setShowEmailForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                <button
                    onClick={() => setShowEmailForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    <Mail size={16} />
                    Send Email
                </button>
            </div>

            {showEmailForm && <EmailForm />}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-900">{user.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs rounded ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                                    <td className="py-3 px-4">
                                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                            <UserCheck size={16} />
                                            Manage Role
                                        </button>
                                    </td>
                                </tr>
                            ))} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};



// Main Content Component
const MainContent: React.FC = () => {
    const { currentView } = useAppContext();

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Overview />;
            case 'products':
                return <ProductManagement />;
            case 'categories':
                return <CategoriesView   />;
            case 'users':
                return <UsersView />;
            // case 'orders':
            //     return <OrdersView />;
            case 'wishlists':
                return <WishlistAdmin />;
            case 'carts':
                return <CartAdmin />;
            default:
                return <Overview />;
        }
    };

    return (
        <>
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto pb-60">
                        {renderView()}
                    </main>
                </div>
            </div>
        </>
    );
};
export default MainContent;
