import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ROLE_ACCESS } from '../context/AppContext';
import api from '../services/api';
import { Landmark, LogIn, Eye, EyeOff, AlertCircle, Loader2, KeyRound, X } from 'lucide-react';

// Get default redirect path based on user role
function getDefaultPath(role) {
  const access = ROLE_ACCESS[role] || [];
  if (access.includes('*') || access.includes('/')) return '/';
  return access[0] || '/login';
}

export default function Login() {
  const { login, isAuthenticated, authLoading, currentUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({ name: '', logo: null });
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch school profile from public endpoint
  useEffect(() => {
    fetch('/api/school-profile/public')
      .then(res => res.json())
      .then(data => setSchoolInfo({ name: data.name || '', logo: data.logo || null }))
      .catch(() => {});
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentUser && !currentUser.isDefaultPassword) {
      const from = location.state?.from?.pathname || getDefaultPath(currentUser.role);
      navigate(from, { replace: true });
    }
    // Show change password modal if default password
    if (!authLoading && isAuthenticated && currentUser?.isDefaultPassword) {
      setShowChangePw(true);
    }
  }, [authLoading, isAuthenticated, currentUser, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Username dan password wajib diisi.'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.isDefaultPassword) {
        setShowChangePw(true);
      } else {
        const from = location.state?.from?.pathname || getDefaultPath(user.role);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPw || newPw.length < 6) { setChangePwError('Password baru minimal 6 karakter.'); return; }
    if (newPw !== confirmPw) { setChangePwError('Konfirmasi password tidak cocok.'); return; }
    setChangePwError('');
    setChangePwLoading(true);
    try {
      await api.changePassword(password, newPw);
      setShowChangePw(false);
      const from = location.state?.from?.pathname || getDefaultPath(currentUser?.role);
      navigate(from, { replace: true });
    } catch (err) {
      setChangePwError(err.message);
    } finally {
      setChangePwLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-b from-primary-50 to-white">
            {schoolInfo.logo ? (
              <img src={schoolInfo.logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Landmark size={28} className="text-gold-400" />
              </div>
            )}
            <h1 className="text-xl font-bold text-primary-800">{schoolInfo.name || 'Sistem Rapor IB-MYP'}</h1>
            <p className="text-sm text-gray-500 mt-1">Sistem Informasi Rapor Sekolah</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username" disabled={loading}
                className="w-full px-4 py-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password" disabled={loading}
                  className="w-full px-4 py-3 text-sm border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? 'Memasuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          {schoolInfo.name || 'IB Islamic School'} &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Change Password Modal */}
      {showChangePw && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in overflow-hidden">
            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-amber-50 to-white text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <KeyRound size={24} className="text-amber-600" />
              </div>
              <h2 className="text-base font-bold text-gray-800">Ubah Password</h2>
              <p className="text-xs text-gray-500 mt-1">Anda masih menggunakan password default. Silakan buat password baru.</p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {changePwError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <AlertCircle size={14} className="shrink-0" />
                  {changePwError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password Baru</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2.5 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Konfirmasi Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2.5 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <button onClick={handleChangePassword} disabled={changePwLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 disabled:opacity-50">
                {changePwLoading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                {changePwLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
