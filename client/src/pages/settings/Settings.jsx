import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import { changePassword, deleteAccount } from '../../api/settings';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';

export const Settings = () => {
  const { user, profile, logout } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Account deletion state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwordForm);
      setPasswordMsg('Password successfully changed!');
      notify('Password changed successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm deletion.');
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);
      notify('Your account and records have been deleted.', 'info');
      await logout();
      navigate('/');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account & App Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your credentials, preferences, and data privacy options.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
              Full Name
            </span>
            <span className="font-bold text-slate-900">{user?.name}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
              Email Address
            </span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
              Active Unit System
            </span>
            <span className="font-medium text-slate-700 capitalize">
              {profile?.measurementUnit || 'metric'} (kg, cm)
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
              Member Since
            </span>
            <span className="text-slate-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </span>
          </div>
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Security & Password
        </h3>

        {passwordMsg && <Alert type="success" message={passwordMsg} />}
        {passwordError && <Alert type="error" message={passwordError} />}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              New Password (Min 6 characters)
            </label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwordForm.confirmNewPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {passwordLoading ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/50 p-6 sm:p-8 rounded-2xl border border-rose-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-rose-900 pb-3 border-b border-rose-200/60 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          Danger Zone: Account Deletion
        </h3>

        <p className="text-xs text-rose-700 leading-relaxed max-w-xl">
          Permanently delete your user account and purge all associated profile settings, workout routines, exercise schedule entries, meal tracking logs, and AI conversation records.
        </p>

        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-rose-600/20 transition-colors"
        >
          Delete Account Permanently
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              This operation is irrevocable. All your routines, workout completions, and meal history will be permanently deleted.
            </span>
          </div>

          {deleteError && <Alert type="error" message={deleteError} />}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Confirm Your Password *
            </label>
            <input
              type="password"
              required
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deleteLoading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-xs disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting Account...' : 'Confirm Delete'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
