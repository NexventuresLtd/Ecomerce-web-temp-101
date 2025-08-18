import { Search, User } from 'lucide-react';
import UserInfo from './UserInfo';


interface SecondNavProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>

}
export default function SecondNav({ isMenuOpen, setIsMenuOpen, setActiveDropdown }: SecondNavProps) {
    return (
        <>
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = "/"}>
                            <div className="px-4 py-3">
                                <h1 className="text-transparent uppercase bg-clip-text bg-black font-extrabold text-3xl leading-tight">
                                    UmukaMezi
                                </h1>
                            </div>
                        </div>

                        {/* Expert Contact */}
                        <div className="hidden xl:flex items-center space-x-2 text-sm">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className='text-xs'>
                                <div className="text-gray-600">Ask Our Experts</div>
                                <div className="font-semibold">250.790.225.000</div>
                            </div>
                        </div>

                        {/* Search Bar */}

                        <div className={`${isMenuOpen ? 'max-xl:hidden' : ''} flex-1 max-w-2xl mx-4`}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                />
                                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>


                        {/* User Account */}
                        <UserInfo showMenu={true} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />
                    </div>
                </div>
            </div>
        </>
    )
}
