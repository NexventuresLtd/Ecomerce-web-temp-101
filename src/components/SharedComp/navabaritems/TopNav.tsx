import {  Phone, HelpCircle, MessageCircle } from 'lucide-react';
import {  topNavItems } from '../../../constants/NabarMain/navLinks';

const TopNav = () => {
    return (
        <>
            {/* Top Bar */}
            <div className="bg-gray-100 border-b border-gray-200 hidden xl:block">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-8 text-xs">
                        <div className="flex space-x-4">
                            {topNavItems.map((item) => (
                                <a key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900">
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600">
                            <span>The Professional's Source since 1973</span>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3" />
                                <span>250.790.225.000</span>
                            </div>
                            <HelpCircle className="w-3 h-3" />
                            <MessageCircle className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNav
