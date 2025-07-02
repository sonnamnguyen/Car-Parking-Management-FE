import React from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
interface HeaderProps {
  search: string;
  setSearch: (val: string) => void;
}
const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  return <div className="flex justify-between items-center mb-6">
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>;
};
export default Header;