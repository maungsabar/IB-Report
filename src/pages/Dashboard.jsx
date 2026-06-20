import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCriteriaKeys, getCriteriaCount } from '../data/dummyData';
import {
  GraduationCap, Users, BookOpen, BarChart3,
  CalendarDays, ClipboardList, ArrowUpCircle, Star,
  TrendingUp, Clock, FileText, Settings,
} from 'lucide-react';

export default function Dashboard() {
  const { students, teachers, subjects, grades, alumni, schoolProfile, activeYear, calculateGradeDynamic, getSemesterLabel } = useApp();

  const activeStudents = students.filter(s => s.status === 'active');

  const avgGrade = (() => {
    if (grades.length === 0) return 0;
    const totals = grades.map(g => {
      const subject = subjects.find(s => s.id === g.subjectId);
      const student = students.find(s => s.id === g.studentId);
      const gradeLevel = student ? parseInt(student.class) : null;
      const cc = getCriteriaCount(subject, gradeLevel);
      const keys = getCriteriaKeys(cc);
      const sum = keys.reduce((acc, k) => acc + (g[`score${k}`] || 0), 0);
      return calculateGradeDynamic(sum, cc) || 0;
    });
    return (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1);
  })();

  const statCards = [
    {
      label: 'Total Siswa',
      value: activeStudents.length,
      icon: GraduationCap,
      color: 'border-l-primary-600',
      iconBg: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Total Guru',
      value: teachers.length,
      icon: Users,
      color: 'border-l-gold-500',
      iconBg: 'bg-gold-50 text-gold-500',
    },
    {
      label: 'Total Mapel',
      value: subjects.length,
      icon: BookOpen,
      color: 'border-l-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-500',
    },
    {
      label: 'Rata-rata Grade',
      value: avgGrade,
      icon: BarChart3,
      color: 'border-l-violet-500',
      iconBg: 'bg-violet-50 text-violet-500',
    },
  ];

  const quickLinks = [
    { label: 'Data Siswa', desc: 'Kelola data siswa', icon: GraduationCap, href: '/master/siswa' },
    { label: 'Data Guru', desc: 'Kelola data guru', icon: Users, href: '/master/guru' },
    { label: 'Mata Pelajaran', desc: 'Kelola mapel MYP', icon: BookOpen, href: '/master/mata-pelajaran' },
    { label: 'Kenaikan Kelas', desc: 'Promosi siswa', icon: ArrowUpCircle, href: '/master/siswa/naik-kelas' },
    { label: 'Raport', desc: 'Generate rapor', icon: FileText, href: '/laporan/rapor' },
    { label: 'Deskriptor', desc: 'Atur kriteria', icon: ClipboardList, href: '/master/deskriptor' },
  ];

  const semesterLabel = getSemesterLabel(activeYear, activeYear?.activeSemester || 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        {/* Islamic geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fff' stroke-width='1'%3E%3Cpolygon points='40,5 55,20 55,40 40,55 25,40 25,20'/%3E%3Cpolygon points='40,25 47.5,32.5 47.5,47.5 40,55 32.5,47.5 32.5,32.5'/%3E%3Cline x1='40' y1='5' x2='40' y2='25'/%3E%3Cline x1='55' y1='20' x2='47.5' y2='32.5'/%3E%3Cline x1='55' y1='40' x2='47.5' y2='47.5'/%3E%3Cline x1='40' y1='55' x2='40' y2='55'/%3E%3Cline x1='25' y1='40' x2='32.5' y2='47.5'/%3E%3Cline x1='25' y1='20' x2='32.5' y2='32.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-gold-400" />
                <span className="text-sm font-medium text-primary-200">IB MYP School Management</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {schoolProfile.name}
              </h1>
              <p className="mt-1 text-primary-200 text-sm md:text-base">
                Selamat datang di Sistem Informasi Akademik
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <CalendarDays size={20} className="text-gold-400" />
              <div>
                <p className="text-sm font-semibold">Tahun Ajaran {activeYear?.year || schoolProfile.academicYear}</p>
                <p className="text-xs text-primary-200">{semesterLabel} - {activeYear?.year || schoolProfile.year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-xl border border-warm-200 shadow-sm p-5 border-l-4 ${card.color} hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section: Quick Links + Recent Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-primary-800 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-primary-600" />
              Akses Cepat
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-warm-100 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
                  >
                    <div className="p-2 rounded-lg bg-warm-100 group-hover:bg-primary-100 transition-colors duration-200">
                      <Icon size={18} className="text-gray-500 group-hover:text-primary-600 transition-colors duration-200" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{link.label}</p>
                      <p className="text-xs text-gray-400">{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-primary-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-600" />
              Statistik Kelas
            </h3>
            <div className="space-y-3">
              {['7A', '7B', '8A', '8B', '9A', '9B'].map(cls => {
                const count = activeStudents.filter(s => s.class === cls).length;
                const max = Math.max(...['7A', '7B', '8A', '8B', '9A', '9B'].map(c => activeStudents.filter(s => s.class === c).length), 1);
                const pct = (count / max) * 100;
                return (
                  <div key={cls}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Kelas {cls}</span>
                      <span className="text-xs font-semibold text-gray-500">{count} siswa</span>
                    </div>
                    <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <Clock size={18} className="text-primary-600" />
              Informasi
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {grades.length} nilai tercatat
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                {alumni.length} alumni terdaftar
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                {semesterLabel} aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
