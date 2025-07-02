import React from 'react';
import { LayoutDashboard, MapPin, CreditCard, FileText, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return <div className="w-64 bg-[#161618] text-gray-300 p-4 flex flex-col justify-between min-h-screen">
    <div>
      <div className="flex items-center justify-center mb-8 mt-4">
        <div className="bg-white p-2 rounded">
          <div className="font-bold text-xl text-[#161618] flex items-center justify-center">
            <span className="text-amber-500">Park.</span>
            <span>AI</span>
          </div>
        </div>
      </div>
      <nav className="space-y-6">
        <NavItem icon={<LayoutDashboard size={20} />} label="Tổng quan" active={activeTab === 'Dashboard'} onClick={() => onTabChange('Dashboard')} />
        <NavItem icon={<MapPin size={20} />} label="Sơ đồ bãi xe" active={activeTab === 'Allotment'} onClick={() => onTabChange('Allotment')} />
        <NavItem icon={<CreditCard size={20} />} label="Thanh toán" active={activeTab === 'Payments'} onClick={() => onTabChange('Payments')} />
        <NavItem icon={<FileText size={20} />} label="Gửi báo cáo" active={activeTab === 'Write Report'} onClick={() => onTabChange('Write Report')} />
      </nav>
    </div>
    <div className="pt-8">
      <NavItem icon={<LogOut size={20} />} label="Đăng xuất" onClick={() => {/* handle logout here if needed */}} />
    </div>
  </div>;
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  onClick
}) => {
  return <div onClick={onClick} className={`flex items-center p-2 space-x-3 rounded cursor-pointer ${active ? 'text-white bg-amber-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>;
};
export default Sidebar;