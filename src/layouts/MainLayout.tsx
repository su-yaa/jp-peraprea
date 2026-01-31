import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-[375px] h-[812px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col pt-[var(--sat)] pb-[var(--sab)] pl-[var(--sal)] pr-[var(--sar)]">
        <Outlet />
      </div>
    </div>
  );
}
