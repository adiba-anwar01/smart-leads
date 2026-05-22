import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, updateUserStatus } from '../api/users.api';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Users as UsersIcon } from 'lucide-react';
import type { User } from '../types';
import { useAuthStore } from '../store/auth.store';

export function UsersPage(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? All their leads will also be deleted. This cannot be undone.')) {
      return;
    }
    
    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = !user.isActive;
      await updateUserStatus(user._id, newStatus);
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setUsers(users.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const formatRole = (role: string) => (role === 'admin' ? 'Admin' : 'Sales User');

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading users...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchUsers} />;
  }

  if (users.length === 0) {
    return <EmptyState icon={<UsersIcon className="w-8 h-8 text-slate-400" />} title="No users found" description="There are currently no users." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
          Users
          {isAdmin && (
            <span className="ml-3 text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400 py-1 px-3 rounded-full">
              {users.length} Total
            </span>
          )}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-5 py-3 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-[13.5px] font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[13.5px] text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11.5px] font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11.5px] font-medium ${
                        user.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/leads?createdBy=${user._id}`)}
                      >
                        View Leads
                      </Button>
                      <Button
                        variant={user.isActive ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
