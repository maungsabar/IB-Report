import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getCriteriaKeys, getCriteriaCount } from '../data/dummyData';
import { BookOpen, Save, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

// Check if a subject is available for a specific grade level
function isSubjectAvailableForGrade(subject, gradeLevel) {
  if (!subject?.availableGrades || subject.availableGrades.length === 0) return true;
  const gl = typeof gradeLevel === 'string' ? parseInt(gradeLevel) : gradeLevel;
  return subject.availableGrades.includes(gl);
}

export default function Descriptors() {
  const { subjects, criteriaDescriptors, setCriteriaDescriptors, saveCriteriaDescriptors, GRADE_LEVELS } = useApp();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(GRADE_LEVELS[0]?.key || '7');
  const [localDescriptors, setLocalDescriptors] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const criteriaCount = getCriteriaCount(selectedSubject, parseInt(selectedGradeLevel));
  const activeCriteria = getCriteriaKeys(criteriaCount);

  // Available grade levels for the selected subject
  const availableGradeLevels = GRADE_LEVELS.filter(gl =>
    isSubjectAvailableForGrade(selectedSubject, gl.key)
  );

  // Auto-select first available grade when subject changes
  useEffect(() => {
    if (selectedSubject && !isSubjectAvailableForGrade(selectedSubject, selectedGradeLevel)) {
      const firstAvailable = GRADE_LEVELS.find(gl => isSubjectAvailableForGrade(selectedSubject, gl.key));
      if (firstAvailable) setSelectedGradeLevel(firstAvailable.key);
    }
  }, [selectedSubjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedSubjectId && criteriaDescriptors[selectedSubjectId]) {
      const src = criteriaDescriptors[selectedSubjectId][selectedGradeLevel];
      const subject = subjects.find(s => s.id === selectedSubjectId);
      const keys = getCriteriaKeys(getCriteriaCount(subject, parseInt(selectedGradeLevel)));
      if (src) {
        const cloned = {};
        keys.forEach(k => {
          cloned[k] = {
            title: src[k]?.title || '',
            descriptors: [...(src[k]?.descriptors || [])],
          };
        });
        setLocalDescriptors(cloned);
      } else {
        const empty = {};
        keys.forEach(k => {
          empty[k] = { title: '', descriptors: [] };
        });
        setLocalDescriptors(empty);
      }
    }
  }, [selectedSubjectId, selectedGradeLevel, criteriaDescriptors, subjects]);

  const updateTitle = (criteria, title) => {
    setLocalDescriptors(prev => ({
      ...prev,
      [criteria]: { ...prev[criteria], title },
    }));
  };

  const updateDescriptors = (criteria, text) => {
    const lines = text.split('\n').filter(l => l.trim());
    setLocalDescriptors(prev => ({
      ...prev,
      [criteria]: { ...prev[criteria], descriptors: lines },
    }));
  };

  const getDescriptorsText = (criteria) => {
    if (!localDescriptors || !localDescriptors[criteria]) return '';
    return (localDescriptors[criteria].descriptors || []).join('\n');
  };

  const handleSave = () => {
    if (!selectedSubjectId || !localDescriptors) return;
    const filtered = {};
    activeCriteria.forEach(k => {
      filtered[k] = localDescriptors[k] || { title: '', descriptors: [] };
    });
    // Merge with existing descriptors for other grade levels
    const existing = criteriaDescriptors[selectedSubjectId] || {};
    const merged = { ...existing, [selectedGradeLevel]: filtered };
    // Optimistic local update
    setCriteriaDescriptors(prev => ({ ...prev, [selectedSubjectId]: merged }));
    // Save to API
    saveCriteriaDescriptors(selectedSubjectId, merged);
    setSaveMsg('Deskriptor berhasil disimpan.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // Check if a subject has descriptors for a specific grade level
  const hasDescriptors = (subjectId, gradeLevel) => {
    return !!criteriaDescriptors[subjectId]?.[gradeLevel];
  };

  const inputCls = 'w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  const criteriaColors = {
    A: { border: 'border-l-primary-600', bg: 'bg-primary-50', text: 'text-primary-700', badge: 'bg-primary-600 text-white' },
    B: { border: 'border-l-gold-500', bg: 'bg-gold-50', text: 'text-gold-600', badge: 'bg-gold-500 text-white' },
    C: { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white' },
    D: { border: 'border-l-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-500 text-white' },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-800">Deskriptor Kriteria</h2>
            <p className="text-sm text-gray-500">Atur deskriptor untuk setiap kriteria berdasarkan mata pelajaran dan tingkat kelas.</p>
          </div>
        </div>
        {saveMsg && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={16} />
            {saveMsg}
          </div>
        )}
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left panel: Subject list */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-warm-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mata Pelajaran</h3>
            </div>
            <div className="divide-y divide-warm-100 max-h-[600px] overflow-y-auto">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                    ${selectedSubjectId === subject.id ? 'bg-primary-50 border-l-3 border-l-primary-600' : 'hover:bg-warm-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selectedSubjectId === subject.id ? 'text-primary-700' : 'text-gray-700'}`}>
                      {subject.shortName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{subject.category}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {GRADE_LEVELS.map(gl => {
                      const available = isSubjectAvailableForGrade(subject, gl.key);
                      return (
                        <span
                          key={gl.key}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            !available
                              ? 'bg-gray-100 text-gray-300 line-through'
                              : hasDescriptors(subject.id, gl.key)
                                ? 'bg-primary-100 text-primary-600'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                          title={available ? gl.label : `${gl.label} — tidak tersedia`}
                        >
                          {gl.key}
                        </span>
                      );
                    })}
                  </div>
                  {selectedSubjectId === subject.id && <ChevronRight size={16} className="text-primary-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: Criteria forms */}
        <div className="lg:col-span-8 xl:col-span-9">
          {!selectedSubject || !localDescriptors ? (
            <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-12 text-center text-gray-400">
              Pilih mata pelajaran untuk mengedit deskriptor.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Subject header */}
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-primary-800">{selectedSubject.name}</h3>
                  <p className="text-xs text-gray-400">{selectedSubject.category}</p>
                </div>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Save size={16} /> Simpan
                </button>
              </div>

              {/* Grade level tabs — only show available grades */}
              <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-1 flex items-center gap-1">
                {availableGradeLevels.map(gl => (
                  <button
                    key={gl.key}
                    onClick={() => setSelectedGradeLevel(gl.key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${selectedGradeLevel === gl.key
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-warm-50 hover:text-gray-700'
                      }`}
                  >
                    <GraduationCap size={16} />
                    <div className="text-left">
                      <p className="font-semibold text-xs">{gl.label}</p>
                      <p className={`text-[10px] ${selectedGradeLevel === gl.key ? 'text-primary-100' : 'text-gray-400'}`}>{gl.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Criteria sections */}
              {activeCriteria.map(key => {
                const colors = criteriaColors[key];
                const criteria = localDescriptors[key];
                return (
                  <div key={key} className={`bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden border-l-4 ${colors.border}`}>
                    <div className={`px-5 py-3 ${colors.bg} flex items-center gap-3`}>
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${colors.badge}`}>
                        {key}
                      </span>
                      <input
                        className={`flex-1 bg-transparent text-base font-semibold ${colors.text} focus:outline-none border-b border-transparent focus:border-current pb-0.5`}
                        value={criteria?.title || ''}
                        onChange={e => updateTitle(key, e.target.value)}
                        placeholder={`Criterion ${key} Title`}
                      />
                    </div>
                    <div className="px-5 py-4">
                      <label className={labelCls}>Deskriptor (satu per baris)</label>
                      <textarea
                        className={`${inputCls} min-h-[120px] resize-y font-mono text-xs leading-relaxed`}
                        value={getDescriptorsText(key)}
                        onChange={e => updateDescriptors(key, e.target.value)}
                        placeholder={`Tulis deskriptor untuk Criterion ${key}, satu per baris...`}
                        rows={Math.max(4, (criteria?.descriptors?.length || 0) + 1)}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        {(criteria?.descriptors?.length || 0)} deskriptor
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
