import React, { Fragment } from 'react';
import ParkingSpot from './ParkingSpot';

// Hàm tạo dữ liệu bãi đỗ xe (không còn dùng, props truyền vào slots)
interface BookingInfo {
  plate: string;
  entry: string;
}
interface Slot {
  id: string;
  occupied: boolean;
  booking: BookingInfo | null;
  status: 'available' | 'busy' | 'booked';
}
interface ParkingGridProps {
  slots: Slot[];
  onSlotClick: (slot: Slot) => void;
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ slots, onSlotClick }) => {
  // Chia thành 4 cột chính
  const cotA = slots.slice(0, 12);
  const cotB = slots.slice(12, 24);
  const cotC = slots.slice(24, 36);
  const cotD = slots.slice(36, 48);
  return <div className="flex gap-6">
      {/* Cột A */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-x-3">
          {cotA.map((spot, index) => <Fragment key={spot.id}>
              <div onClick={() => onSlotClick(spot)} className="cursor-pointer">
                <ParkingSpot id={spot.id} occupied={spot.occupied} status={spot.status} />
              </div>
              {index % 2 === 1 && index < cotA.length - 2 && <div className="col-span-2 h-px bg-gray-200 my-3"></div>}
            </Fragment>)}
        </div>
      </div>
      {/* Cột B */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-x-3">
          {cotB.map((spot, index) => <Fragment key={spot.id}>
              <div onClick={() => onSlotClick(spot)} className="cursor-pointer">
                <ParkingSpot id={spot.id} occupied={spot.occupied} status={spot.status} />
              </div>
              {index % 2 === 1 && index < cotB.length - 2 && <div className="col-span-2 h-px bg-gray-200 my-3"></div>}
            </Fragment>)}
        </div>
      </div>
      {/* Cột C */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-x-3">
          {cotC.map((spot, index) => <Fragment key={spot.id}>
              <div onClick={() => onSlotClick(spot)} className="cursor-pointer">
                <ParkingSpot id={spot.id} occupied={spot.occupied} status={spot.status} />
              </div>
              {index % 2 === 1 && index < cotC.length - 2 && <div className="col-span-2 h-px bg-gray-200 my-3"></div>}
            </Fragment>)}
        </div>
      </div>
      {/* Cột D */}
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-x-3">
          {cotD.map((spot, index) => <Fragment key={spot.id}>
              <div onClick={() => onSlotClick(spot)} className="cursor-pointer">
                <ParkingSpot id={spot.id} occupied={spot.occupied} status={spot.status} />
              </div>
              {index % 2 === 1 && index < cotD.length - 2 && <div className="col-span-2 h-px bg-gray-200 my-3"></div>}
            </Fragment>)}
        </div>
      </div>
    </div>;
};
export default ParkingGrid;