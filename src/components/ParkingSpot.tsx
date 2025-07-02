import React from 'react';
const ParkingSpot = ({
  id,
  occupied,
  status
}: {
  id: string;
  occupied: boolean;
  status: 'available' | 'busy' | 'booked';
}) => {
  if (status === 'busy') {
    return <div className="flex h-16 border border-gray-200 rounded-md overflow-hidden bg-amber-100">
      <div className="flex-1 flex items-center justify-center text-amber-600 text-xl">
        <span role="img" aria-label="Đang dùng">🚗</span>
      </div>
    </div>;
  }
  if (status === 'booked') {
    return <div className="flex h-16 border border-gray-200 rounded-md overflow-hidden bg-red-100">
      <div className="flex-1 flex items-center justify-center text-red-600 text-xl">
        <span role="img" aria-label="Đã đặt">📅</span>
      </div>
    </div>;
  }
  // available
  return <div className="flex h-16 border border-gray-200 rounded-md overflow-hidden">
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <span className="text-gray-500 font-medium text-sm">Chỗ {id}</span>
    </div>
  </div>;
};
const CarIcon = () => {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#161618]">
      <path d="M5 11L6.5 6.5H17.5L19 11M14 15H10M3 11H21V19H3V11ZM6 19V21H8V19M16 19V21H18V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};
export default ParkingSpot;