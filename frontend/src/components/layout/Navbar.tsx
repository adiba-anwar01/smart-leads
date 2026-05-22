import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';
import { Menu, ChevronDown, LogOut, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  pageTitle: string;
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ pageTitle, onMenuClick }) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">

      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white leading-tight">{pageTitle}</h1>
          <p className="text-slate-400 dark:text-slate-500 text-[11px] leading-none mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">

        <ThemeToggle />


        {user && (
          <div className="relative">
            <button
              id="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[12px] font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-[13px] font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  id="logout-btn"
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} aria-hidden="true" />
      )}
    </header>
  );
};

function ThemeToggle(): React.JSX.Element {
  const { isDark, toggle } = useThemeStore();
  return (
    <button
      id="dark-mode-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

