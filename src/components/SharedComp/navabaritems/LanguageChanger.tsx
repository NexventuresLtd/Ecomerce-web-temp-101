import { useState } from "react";
import { ChevronDown } from "lucide-react"; 
import { languages } from "../../../constants/NabarMain/NavLangauge"; 

// ✅ Interface outside component
interface Language {
  code: string;
  label: string;
  flag: string;
}

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang: Language): void => {
    setSelectedLang(lang);
    setIsOpen(false); 
    console.log("Language selected:", lang.code);
  };

  return (
    <div className="lg:flex items-center text-sm relative">
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-3 border border-gray-100 rounded-md hover:border-orange-100 focus:outline-none focus:ring-2 cursor-pointer focus:ring-orange-100"
        >
          <img
            src={selectedLang.flag}
            alt={selectedLang.code}
            className="w-5 h-5 rounded-sm"
          />
          <span>{selectedLang.label}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <img
                    src={lang.flag}
                    alt={lang.code}
                    className="w-5 h-5 mr-2 rounded-sm"
                  />
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageDropdown;
