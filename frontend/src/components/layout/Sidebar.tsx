import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LayoutDashboard, Target, Users, LogOut, TrendingUp } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />,
  },
  {
    label: 'Leads',
    path: '/leads',
    icon: <Target className="w-[18px] h-[18px] shrink-0" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatRole = (role: string) =>
    role === 'admin' ? 'Administrator' : 'Sales User';

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[260px]
          bg-emerald-50 dark:bg-slate-900
          border-r border-emerald-100 dark:border-slate-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >

        <div className="flex items-center gap-3 px-5 py-5 border-b border-emerald-100 dark:border-slate-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 shadow-lg shadow-emerald-500/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white font-semibold text-[15px] tracking-tight leading-none">SmartLeads</h1>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-none">CRM Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-[13.5px] font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-white text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 shadow-sm dark:shadow-none'
                    : 'text-emerald-700/70 hover:bg-emerald-100/50 hover:text-emerald-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                  }
                `}
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600/60 group-hover:text-emerald-700 dark:text-slate-400 dark:group-hover:text-emerald-400'}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              onClick={() => { navigate('/users'); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-[13.5px] font-medium mt-1
                transition-all duration-200 group
                ${location.pathname === '/users'
                  ? 'bg-white text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 shadow-sm dark:shadow-none'
                  : 'text-emerald-700/70 hover:bg-emerald-100/50 hover:text-emerald-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                }
              `}
            >
              <span className={`transition-colors duration-200 ${location.pathname === '/users' ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600/60 group-hover:text-emerald-700 dark:text-slate-400 dark:group-hover:text-emerald-400'}`}>
                <Users className="w-[18px] h-[18px] shrink-0" />
              </span>
              Users
              {location.pathname === '/users' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
            </button>
          )}
        </nav>

        {user && (
          <div className="px-3 py-4 border-t border-emerald-100 dark:border-slate-800">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-100/40 dark:bg-slate-800/30 mb-2 border border-emerald-100/50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-[13px] font-medium truncate leading-tight">{user.name}</p>
                <p className="text-slate-500 text-[11px] truncate leading-tight mt-0.5">{formatRole(user.role)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-700/70 hover:text-red-500 hover:bg-red-50 text-[12.5px] transition-all duration-200 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
