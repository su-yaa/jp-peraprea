import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="w-full min-h-screen bg-cream flex justify-center items-center p-4">
      {/* Phone Container */}
      <div className={
        "w-full max-w-[375px] h-[800px] bg-white rounded-5xl shadow-2xl overflow-hidden relative flex flex-col " +
        "border-[8px] border-white ring-4 ring-gray-100" // Cute double border effect
      }>
        <div className="flex-1 overflow-hidden relative flex flex-col pt-[var(--sat)] pb-[var(--sab)] pl-[var(--sal)] pr-[var(--sar)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
