import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ParkingGrid from './components/ParkingGrid';

// Types
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
type ModalState = { type: 'assign' | 'info'; slotId: string } | null;

// Helper to generate initial slots
const generateParkingData = (): Slot[] => {
  const areas = [
    { prefix: 'A', count: 12 },
    { prefix: 'B', count: 12 },
    { prefix: 'C', count: 12 },
    { prefix: 'D', count: 12 },
  ];
  const spots: Slot[] = [];
  areas.forEach(area => {
    for (let i = 1; i <= area.count; i++) {
      const spotId = `${area.prefix}${i < 10 ? '0' + i : i}`;
      // Randomly assign status for demo
      let status: 'available' | 'busy' | 'booked';
      const rand = Math.random();
      if (rand < 0.15) status = 'booked';
      else if (rand < 0.3) status = 'busy';
      else status = 'available';
      spots.push({
        id: spotId,
        occupied: status !== 'available',
        booking: status !== 'available' ? { plate: status === 'busy' ? '59A-123.45' : '51B-678.90', entry: '2024-06-01 09:00' } : null,
        status,
      });
    }
  });
  return spots;
};

const paymentsData = [
  { id: 1, slot: 'A03', plate: 'ABC-123', time: '2024-06-01 09:00', amount: 20, status: 'Paid' },
  { id: 2, slot: 'A08', plate: 'XYZ-789', time: '2024-06-01 10:30', amount: 15, status: 'Unpaid' },
  { id: 3, slot: 'B04', plate: 'JKL-456', time: '2024-06-01 11:15', amount: 18, status: 'Paid' },
  { id: 4, slot: 'C01', plate: 'DEF-222', time: '2024-06-01 12:00', amount: 22, status: 'Paid' },
  { id: 5, slot: 'D12', plate: 'MNO-333', time: '2024-06-01 13:00', amount: 25, status: 'Unpaid' },
];

const weeklyRevenue = [120, 180, 90, 200, 150, 220, 170]; // Mock revenue for 7 days
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function App() {
  const [slots, setSlots] = useState<Slot[]>(generateParkingData());
  const [modal, setModal] = useState<ModalState>(null); // { type: 'assign'|'info', slotId }
  const [tab, setTab] = useState<'Dashboard' | 'Allotment' | 'Payments' | 'Write Report'>('Dashboard');
  const [search, setSearch] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'All' | 'Paid' | 'Unpaid' | 'Pending'>('All');
  const [paymentDateFrom, setPaymentDateFrom] = useState('');
  const [paymentDateTo, setPaymentDateTo] = useState('');
  const [revenueChart, setRevenueChart] = useState<'week' | 'month'>('month');
  const [revenueYear, setRevenueYear] = useState<'This Year' | 'Last Year'>('This Year');
  const [revenueWeek, setRevenueWeek] = useState<'This Week' | 'Last Week'>('This Week');
  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsPerPage = 10;
  const [weekChartType, setWeekChartType] = useState<'bar' | 'area'>('bar');
  const [monthChartType, setMonthChartType] = useState<'bar' | 'area'>('bar');

  // Filter slots by search
  const filteredSlots = slots.filter(s => s.id.toLowerCase().includes(search.toLowerCase()));

  // Modal handlers
  const openAssignModal = (slotId: string) => setModal({ type: 'assign', slotId });
  const openInfoModal = (slotId: string) => setModal({ type: 'info', slotId });
  const closeModal = () => setModal(null);

  // Assign car to slot
  const handleAssign = (slotId: string, plate: string, entry: string) => {
    setSlots(slots => slots.map(s => s.id === slotId ? { ...s, occupied: true, booking: { plate, entry } } : s));
    closeModal();
  };
  // Free slot
  const handleFree = (slotId: string) => {
    setSlots(slots => slots.map(s => s.id === slotId ? { ...s, occupied: false, booking: null } : s));
    closeModal();
  };

  // Wrapper for sidebar tab change
  const handleTabChange = (tab: string) => {
    setTab(tab as 'Dashboard' | 'Allotment' | 'Payments' | 'Write Report');
  };

  // Tab content
  let content;
  if (tab === 'Dashboard') {
    // Dashboard mock data
    const lotInfo = {
      name: 'Bãi Đỗ Xe An Phú Quận 2',
      address: '120 Nguyễn Cơ Thạch, P. An Lợi Đông, TP. Thủ Đức',
      rating: 4.7,
      image: 'https://maisonoffice.vn/wp-content/uploads/2024/08/bai-do-xe-hoi.jpg',
      total: slots.length,
      available: slots.filter(s => s.status === 'available').length,
      busy: slots.filter(s => s.status === 'busy').length,
      book: slots.filter(s => s.status === 'booked').length,
      price: 5000,
      admin: { name: 'Nguyễn Minh Hòa', email: 'hoa.nguyen@parkai.vn', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
    };
    // Dữ liệu doanh thu theo tuần và theo tháng
    const daysVN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const revenueThisWeek = [3200000, 8500000, 6000000, 2200000, 3000000, 8200000, 6500000];
    const revenueLastWeek = [4000000, 9000000, 5000000, 3000000, 4500000, 6000000, 4000000];
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const revenueThisYear = [12000000, 14500000, 9000000, 17000000, 15500000, 18000000, 20000000, 17500000, 16000000, 14000000, 13000000, 15000000];
    const revenueLastYear = [10000000, 12000000, 8000000, 15000000, 14000000, 16000000, 17000000, 16000000, 15000000, 13000000, 12000000, 14000000];
    const maxRevenueMonth = 20000000;
    const maxRevenueWeek = 10000000;
    // Donut chart data
    const donutTotal = lotInfo.total;
    const donutAvailable = lotInfo.available;
    const donutBusy = lotInfo.busy + lotInfo.book;
    const donutAvailablePct = (donutAvailable / donutTotal) * 100;
    const donutBusyPct = (donutBusy / donutTotal) * 100;
    content = <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Right sidebar: Summary card + Donut chart (scrollable) */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-8 order-1 md:order-2">
        {/* Summary Card trên */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 w-full justify-between">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Đang hoạt động</span>
            <button className="text-blue-500 text-xs underline">Chỉnh sửa</button>
          </div>
          <img src={lotInfo.image} alt="Parking" className="rounded-lg w-full h-24 object-cover mb-2" />
          <div className="font-bold text-base mb-1 text-center">{lotInfo.name} <span className="text-amber-500 font-normal text-sm">★ {lotInfo.rating}</span></div>
          <div className="text-gray-500 text-xs mb-2 text-center">{lotInfo.address}</div>
          <div className="grid grid-cols-2 gap-2 w-full my-2">
            <div className="bg-gray-900 text-white rounded-lg flex flex-col items-center py-2">
              <div className="text-lg font-bold">{lotInfo.total}</div>
              <div className="text-xs mt-1">Tổng số chỗ</div>
            </div>
            <div className="bg-blue-700 text-white rounded-lg flex flex-col items-center py-2">
              <div className="text-lg font-bold">{lotInfo.available}</div>
              <div className="text-xs mt-1">Chỗ trống</div>
            </div>
            <div className="bg-amber-500 text-white rounded-lg flex flex-col items-center py-2">
              <div className="text-lg font-bold">{lotInfo.busy}</div>
              <div className="text-xs mt-1">Đang dùng</div>
            </div>
            <div className="bg-red-600 text-white rounded-lg flex flex-col items-center py-2">
              <div className="text-lg font-bold">{lotInfo.book.toString().padStart(2, '0')}</div>
              <div className="text-xs mt-1">Đã đặt</div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1 w-full mt-2">
            <span className="text-gray-500 text-xs">Giá/giờ</span>
            <span className="font-bold text-base">{lotInfo.price}VNĐ</span>
          </div>
          <div className="flex items-center gap-2 mt-3 w-full">
            <img src={lotInfo.admin.avatar} alt="Admin" className="w-8 h-8 rounded-full" />
            <div>
              <div className="font-semibold text-xs">{lotInfo.admin.name}</div>
              <div className="text-xs text-gray-500">{lotInfo.admin.email}</div>
            </div>
            <button className="ml-auto text-blue-500 text-xs underline"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg></button>
          </div>
        </div>
        {/* Donut Chart dưới */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center w-full mt-6">
          <span className="font-semibold mb-2">Tình trạng chỗ</span>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="75" fill="#f3f4f6" />
            {/* Available */}
            <circle
              cx="90" cy="90" r="75"
              fill="none"
              stroke="#2563eb"
              strokeWidth="22"
              strokeDasharray={`${(donutAvailablePct / 100) * 471} 471`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Busy+Book */}
            <circle
              cx="90" cy="90" r="75"
              fill="none"
              stroke="#f59e42"
              strokeWidth="22"
              strokeDasharray={`${(donutBusyPct / 100) * 471} 471`}
              strokeDashoffset={`${(donutAvailablePct / 100) * 471}`}
              strokeLinecap="round"
            />
            <text x="90" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#111">{Math.round(donutAvailablePct)}%</text>
            <text x="90" y="125" textAnchor="middle" fontSize="16" fill="#888">Chỗ trống</text>
          </svg>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-700 inline-block"></span><span className="text-sm">Chỗ trống</span></div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-500 inline-block"></span><span className="text-sm">Đang dùng + Đã đặt</span></div>
          </div>
        </div>
      </div>
      {/* Main Dashboard Charts: Hiển thị cả 2 biểu đồ tuần và tháng, mỗi cái có nút chuyển cột/miền và chú thích riêng */}
      <div className="flex-1 flex flex-col gap-8 order-2 md:order-1">
        {/* Biểu đồ doanh thu theo tuần */}
        <div className="bg-white rounded-xl shadow p-8 mb-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold text-lg">Doanh thu theo tuần</span>
            <button onClick={() => setWeekChartType('bar')} className={`px-3 py-1 rounded-l-full rounded-r ${weekChartType === 'bar' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>Cột</button>
            <button onClick={() => setWeekChartType('area')} className={`px-3 py-1 rounded-r-full rounded-l ${weekChartType === 'area' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>Miền</button>
          </div>
          <div className="text-sm text-gray-500 mb-2">Biểu đồ thể hiện doanh thu từng ngày trong tuần này và tuần trước.</div>
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>Tuần này</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>Tuần trước</div>
          </div>
          <svg width="100%" height="320" viewBox="0 0 1000 300">
            {/* Y axis grid/labels */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <g key={i}>
                <line x1={60} x2={960} y1={40 + i * 48} y2={40 + i * 48} stroke="#e5e7eb" />
                <text x={10} y={45 + i * 48} fontSize="13" fill="#888">{`₫${(Math.round((maxRevenueWeek - (maxRevenueWeek / 5) * i) / 1000000))}tr`}</text>
              </g>
            ))}
            {/* X axis labels */}
            {daysVN.map((d, i) => (
              <text key={d} x={120 + i * 120} y={295} fontSize="15" textAnchor="middle">{d}</text>
            ))}
            {/* Bar chart */}
            {weekChartType === 'bar' && revenueThisWeek.map((val, i) => (
              <rect key={i} x={105 + i * 100} y={40 + (240 - (val / maxRevenueWeek) * 240)} width="60" height={(val / maxRevenueWeek) * 240} fill="#22c55e" />
            ))}
            {weekChartType === 'bar' && revenueLastWeek.map((val, i) => (
              <rect key={i} x={105 + i * 100} y={40 + (240 - (val / maxRevenueWeek) * 240)} width="60" height={(val / maxRevenueWeek) * 240} fill="#d1fae5" opacity={0.7} />
            ))}
            {/* Area chart */}
            {weekChartType === 'area' && (
              <>
                <polyline
                  fill="none"
                  stroke="#d1fae5"
                  strokeWidth="4"
                  points={revenueLastWeek.map((val, i) => `${135 + i * 100},${40 + (240 - (val / maxRevenueWeek) * 240)}`).join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  points={revenueThisWeek.map((val, i) => `${135 + i * 100},${40 + (240 - (val / maxRevenueWeek) * 240)}`).join(' ')}
                />
                {/* Area fill for this week */}
                <polygon
                  fill="#22c55e33"
                  stroke="none"
                  points={revenueThisWeek.map((val, i) => `${135 + i * 100},${40 + (240 - (val / maxRevenueWeek) * 240)}`).join(' ') + ` 735,280 135,280`}
                />
                {/* Area fill for last week */}
                <polygon
                  fill="#d1fae533"
                  stroke="none"
                  points={revenueLastWeek.map((val, i) => `${135 + i * 100},${40 + (240 - (val / maxRevenueWeek) * 240)}`).join(' ') + ` 735,280 135,280`}
                />
                {/* Dots */}
                {revenueThisWeek.map((val, i) => (
                  <circle key={i} cx={135 + i * 100} cy={40 + (240 - (val / maxRevenueWeek) * 240)} r={7} fill="#22c55e" />
                ))}
                {revenueLastWeek.map((val, i) => (
                  <circle key={i} cx={135 + i * 100} cy={40 + (240 - (val / maxRevenueWeek) * 240)} r={7} fill="#d1fae5" />
                ))}
              </>
            )}
          </svg>
        </div>
        {/* Biểu đồ doanh thu theo tháng */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold text-lg">Doanh thu theo tháng</span>
            <button onClick={() => setMonthChartType('bar')} className={`px-3 py-1 rounded-l-full rounded-r ${monthChartType === 'bar' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>Cột</button>
            <button onClick={() => setMonthChartType('area')} className={`px-3 py-1 rounded-r-full rounded-l ${monthChartType === 'area' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>Miền</button>
          </div>
          <div className="text-sm text-gray-500 mb-2">Biểu đồ thể hiện doanh thu từng tháng trong năm nay và năm trước.</div>
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>Năm nay</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>Năm trước</div>
          </div>
          <svg width="100%" height="320" viewBox="0 0 1000 300">
            {/* Y axis grid/labels */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <g key={i}>
                <line x1={60} x2={960} y1={40 + i * 48} y2={40 + i * 48} stroke="#e5e7eb" />
                <text x={10} y={45 + i * 48} fontSize="13" fill="#888">{`₫${(Math.round((maxRevenueMonth - (maxRevenueMonth / 5) * i) / 1000000))}tr`}</text>
              </g>
            ))}
            {/* X axis labels */}
            {months.map((d, i) => (
              <text key={d} x={90 + i * 70} y={295} fontSize="15" textAnchor="middle">{d}</text>
            ))}
            {/* Bar chart */}
            {monthChartType === 'bar' && revenueThisYear.map((val, i) => (
              <rect key={i} x={75 + i * 65} y={40 + (240 - (val / maxRevenueMonth) * 240)} width="40" height={(val / maxRevenueMonth) * 240} fill="#22c55e" />
            ))}
            {monthChartType === 'bar' && revenueLastYear.map((val, i) => (
              <rect key={i} x={75 + i * 65} y={40 + (240 - (val / maxRevenueMonth) * 240)} width="40" height={(val / maxRevenueMonth) * 240} fill="#d1fae5" opacity={0.7} />
            ))}
            {/* Area chart */}
            {monthChartType === 'area' && (
              <>
                <polyline
                  fill="none"
                  stroke="#d1fae5"
                  strokeWidth="4"
                  points={revenueLastYear.map((val, i) => `${95 + i * 65},${40 + (240 - (val / maxRevenueMonth) * 240)}`).join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  points={revenueThisYear.map((val, i) => `${95 + i * 65},${40 + (240 - (val / maxRevenueMonth) * 240)}`).join(' ')}
                />
                {/* Area fill for this year */}
                <polygon
                  fill="#22c55e33"
                  stroke="none"
                  points={revenueThisYear.map((val, i) => `${95 + i * 65},${40 + (240 - (val / maxRevenueMonth) * 240)}`).join(' ') + ` 815,280 95,280`}
                />
                {/* Area fill for last year */}
                <polygon
                  fill="#d1fae533"
                  stroke="none"
                  points={revenueLastYear.map((val, i) => `${95 + i * 65},${40 + (240 - (val / maxRevenueMonth) * 240)}`).join(' ') + ` 815,280 95,280`}
                />
                {/* Dots */}
                {revenueThisYear.map((val, i) => (
                  <circle key={i} cx={95 + i * 65} cy={40 + (240 - (val / maxRevenueMonth) * 240)} r={7} fill="#22c55e" />
                ))}
                {revenueLastYear.map((val, i) => (
                  <circle key={i} cx={95 + i * 65} cy={40 + (240 - (val / maxRevenueMonth) * 240)} r={7} fill="#d1fae5" />
                ))}
              </>
            )}
          </svg>
        </div>
      </div>
    </div>;
  } else if (tab === 'Allotment') {
    content = <ParkingGrid slots={filteredSlots} onSlotClick={(slot: Slot) => slot.occupied ? openInfoModal(slot.id) : openAssignModal(slot.id)} />;
  } else if (tab === 'Payments') {
    // Add pending status and VND
    const paymentsDataVND = [
      { id: 1, slot: 'A03', plate: 'ABC-123', time: '2024-06-01 09:00', amount: 20000, status: 'Paid' },
      { id: 2, slot: 'A08', plate: 'XYZ-789', time: '2024-06-01 10:30', amount: 15000, status: 'Unpaid' },
      { id: 3, slot: 'B04', plate: 'JKL-456', time: '2024-06-01 11:15', amount: 18000, status: 'Paid' },
      { id: 4, slot: 'C01', plate: 'DEF-222', time: '2024-06-01 12:00', amount: 22000, status: 'Pending' },
      { id: 5, slot: 'D12', plate: 'MNO-333', time: '2024-06-01 13:00', amount: 25000, status: 'Unpaid' },
    ];
    const filteredPayments = paymentsDataVND.filter(p => {
      const paymentDate = p.time.slice(0, 10);
      const afterFrom = !paymentDateFrom || paymentDate >= paymentDateFrom;
      const beforeTo = !paymentDateTo || paymentDate <= paymentDateTo;
      return (
        (paymentStatus === 'All' || p.status === paymentStatus) &&
        (p.slot.toLowerCase().includes(search.toLowerCase()) ||
          p.plate.toLowerCase().includes(search.toLowerCase()) ||
          p.time.toLowerCase().includes(search.toLowerCase())) &&
        afterFrom && beforeTo
      );
    });
    // Pagination logic
    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
    const paginatedPayments = filteredPayments.slice((paymentsPage - 1) * paymentsPerPage, paymentsPage * paymentsPerPage);
    content = <div>
      <div className="flex gap-4 mb-4 items-center">
        <select
          className="border rounded px-2 py-1"
          value={paymentStatus}
          onChange={e => { setPaymentStatus(e.target.value as 'All' | 'Paid' | 'Unpaid' | 'Pending'); setPaymentsPage(1); }}
        >
          <option value="All">Tất cả</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="Unpaid">Chưa thanh toán</option>
          <option value="Pending">Chờ xử lý</option>
        </select>
        <span>Từ ngày</span>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={paymentDateFrom}
          onChange={e => { setPaymentDateFrom(e.target.value); setPaymentsPage(1); }}
          placeholder="Từ ngày"
        />
        <span>Đến ngày</span>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={paymentDateTo}
          onChange={e => { setPaymentDateTo(e.target.value); setPaymentsPage(1); }}
          placeholder="Đến ngày"
        />
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Chỗ</th><th>Biển số</th><th>Thời gian</th><th>Số tiền</th><th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map(p => <tr key={p.id} className="text-center border-t">
            <td className="p-2">{p.slot}</td>
            <td>{p.plate}</td>
            <td>{p.time}</td>
            <td>{p.amount.toLocaleString()} VNĐ</td>
            <td className={
              p.status === 'Paid' ? 'text-green-600' :
              p.status === 'Pending' ? 'text-yellow-600' :
              'text-red-500'
            }>{p.status === 'Paid' ? 'Đã thanh toán' : p.status === 'Pending' ? 'Chờ xử lý' : 'Chưa thanh toán'}</td>
          </tr>)}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPaymentsPage(p => Math.max(1, p - 1))}
          disabled={paymentsPage === 1}
        >Trước</button>
        <span>Trang {paymentsPage} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPaymentsPage(p => Math.min(totalPages, p + 1))}
          disabled={paymentsPage === totalPages}
        >Tiếp</button>
      </div>
    </div>;
  } else if (tab === 'Write Report') {
    content = <WriteReportForm />;
  }

  // Modal rendering
  let modalContent = null;
  if (modal) {
    const slot = slots.find(s => s.id === modal.slotId)!;
    if (slot.status === 'available') {
      // Modal for available slot: only allow setting to busy
      modalContent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chỗ {slot.id}</h2>
            <div className="mb-3 text-sm text-gray-600">Bạn muốn chuyển chỗ này sang trạng thái đang dùng?</div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 bg-amber-500 text-white rounded" onClick={() => {
                setSlots(slots => slots.map(s => s.id === slot.id ? { ...s, status: 'busy', occupied: true, booking: { plate: '59A-123.45', entry: '2024-06-01 09:00' } } : s));
                closeModal();
              }}>Đang dùng</button>
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      );
    } else if (slot.status === 'booked') {
      // Modal for booked slot: can change to busy
      modalContent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chỗ {slot.id} (Đã đặt)</h2>
            <div className="mb-3 text-sm text-gray-600">Biển số: {slot.booking?.plate}</div>
            <div className="mb-3 text-sm text-gray-600">Thời gian: {slot.booking?.entry}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 bg-amber-500 text-white rounded" onClick={() => {
                setSlots(slots => slots.map(s => s.id === slot.id ? { ...s, status: 'busy', occupied: true, booking: { ...s.booking!, plate: '59A-123.45' } } : s));
                closeModal();
              }}>Chuyển sang đang dùng</button>
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      );
    } else if (slot.status === 'busy') {
      // Modal for busy slot: can free
      modalContent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chỗ {slot.id} (Đang dùng)</h2>
            <div className="mb-3 text-sm text-gray-600">Biển số: {slot.booking?.plate}</div>
            <div className="mb-3 text-sm text-gray-600">Thời gian: {slot.booking?.entry}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => {
                setSlots(slots => slots.map(s => s.id === slot.id ? { ...s, status: 'available', occupied: false, booking: null } : s));
                closeModal();
              }}>Trả chỗ</button>
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex w-full bg-gray-100">
      <Sidebar activeTab={tab} onTabChange={handleTabChange} />
      <div className="flex-1">
        <div className="bg-white p-6 rounded-lg shadow-sm m-4">
          {(tab === 'Allotment' || tab === 'Payments') && (
            <Header search={search} setSearch={setSearch} />
          )}
          {content}
        </div>
        {modalContent}
      </div>
    </div>
  );
}

function WriteReportForm() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Chung');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 border border-amber-100">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <svg width="28" height="28" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
        Gửi báo cáo cho quản trị viên
      </h2>
      <p className="text-gray-500 mb-6">Vui lòng điền đầy đủ thông tin bên dưới để gửi báo cáo. Tất cả các trường đều bắt buộc trừ phần đính kèm.</p>
      {sent ? (
        <div className="bg-green-100 text-green-700 p-4 rounded flex items-center gap-2">
          <svg width="24" height="24" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          Gửi báo cáo thành công!
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Tiêu đề</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nhập tiêu đề..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Danh mục</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="Chung">Chung</option>
              <option value="Kỹ thuật">Kỹ thuật</option>
              <option value="Thanh toán">Thanh toán</option>
              <option value="Chỗ đỗ xe">Chỗ đỗ xe</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Nội dung</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              rows={6}
              placeholder="Mô tả vấn đề hoặc góp ý của bạn..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Đính kèm (tùy chọn)</label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            {file && <div className="text-xs text-gray-600 mt-1">Đã chọn: {file.name}</div>}
          </div>
          <button type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded transition">Gửi báo cáo</button>
        </form>
      )}
    </div>
  );
}
