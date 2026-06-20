import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Search, User, Menu, LogOut, ChevronDown, KeyRound } from 'lucide-react';

const ROLE_LABELS = {
  admin: 'Administrator',
  coordinator: 'Koordinator MYP',
  homeroom: 'Wali Kelas',
  subject: 'Guru Mapel',
};

export default function Header({ onMenuToggle }) {
  const { schoolProfile, activeYear, getSemesterLabel, currentUser, logout } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-warm-200 px-4 sm:px-6 h-[52px] flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <button onClick={onMenuToggle}
          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-warm-100 rounded-lg transition-all duration-200">
          <Menu size={20} />
        </button>
        <div className="relative max-w-sm flex-1 hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari siswa, guru, mata pelajaran..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-warm-100 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          {activeYear?.year || '2025/2026'} · {getSemesterLabel(activeYear, activeYear?.activeSemester || 2)}
        </span>
        <div className="w-px h-6 bg-warm-200 hidden sm:block" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-warm-100 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-primary-800 leading-tight truncate max-w-[140px]">{currentUser?.name || 'User'}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{ROLE_LABELS[currentUser?.role] || currentUser?.role}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-warm-200 shadow-lg py-1 animate-fade-in z-50">
              <div className="px-4 py-2.5 border-b border-warm-100">
                <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.name}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser?.email || currentUser?.username}</p>
              </div>
              <button
                onClick={() => { setShowDropdown(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
