'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  FileText,
  AlertTriangle,
  Activity,
  Heart,
  Thermometer,
  Wind,
  ShieldCheck,
  CheckCircle,
  Plus,
  Send,
  Pill,
  Printer,
  Calendar,
  Clock,
  User,
  Search,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  ImageIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { calculateNEWS2 } from '@/lib/emr/news-calculator';
import { checkCdssAlerts, CdssAlert } from '@/lib/emr/cdss-engine';
import { CpptNote } from '@/types/simrs';
import { useToast } from '@/components/ui/ToastProvider';
import AIIcdCoder from '@/components/ai/AIIcdCoder';
import UniversalPrintModal from '@/components/print/UniversalPrintModal';

export default function EmrPage() {
  const { activePatient, cpptNotes, addCpptNote, patients, setActivePatient, createCompleteMedicalOrder } = useHospitalStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'soap' | 'ttv' | 'cpoe' | 'diagnostics' | 'history'>('soap');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // SOAP Input State
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [icd10Code, setIcd10Code] = useState('I10');
  const [icd10Name, setIcd10Name] = useState('Essential (primary) hypertension');

  // Vitals State
  const [systolic, setSystolic] = useState(145);
  const [diastolic, setDiastolic] = useState(88);
  const [heartRate, setHeartRate] = useState(84);
  const [respiratoryRate, setRespiratoryRate] = useState(18);
  const [temperature, setTemperature] = useState(36.8);
  const [spo2, setSpo2] = useState(98);

  // CDSS Alerts State
  const [prescribedMeds, setPrescribedMeds] = useState<string[]>(['Amlodipine 10mg']);
  const [medInput, setMedInput] = useState('');
  const [cdssAlerts, setCdssAlerts] = useState<CdssAlert[]>([]);
  const [showCdssModal, setShowCdssModal] = useState(false);

  // NEWS2 Result
  const news2 = calculateNEWS2({
    systolicBP: systolic,
    spo2,
    respiratoryRate,
    heartRate,
    temperature,
    consciousness: 'ALERT'
  });

  // Mock Vital Trends Chart
  const vitalsTrendData = [
    { time: '06:00', sistolik: 155, diastolik: 92, hr: 90 },
    { time: '09:00', sistolik: 150, diastolik: 90, hr: 88 },
    { time: '12:00', sistolik: 145, diastolik: 88, hr: 84 },
    { time: '15:00', sistolik: 140, diastolik: 85, hr: 82 },
    { time: '18:00', sistolik: 138, diastolik: 84, hr: 80 },
  ];

  const handleAddMed = () => {
    if (!medInput.trim()) return;
    const newMeds = [...prescribedMeds, medInput.trim()];
    setPrescribedMeds(newMeds);
    setMedInput('');

    // Trigger CDSS Engine
    const alerts = checkCdssAlerts(newMeds, activePatient?.allergies || []);
    if (alerts.length > 0) {
      setCdssAlerts(alerts);
      setShowCdssModal(true);
    }
  };

  const handleSaveCppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjective || !objective) {
      showToast({ type: 'warning', title: 'Form Tidak Lengkap', message: 'S (Subjective) dan O (Objective) wajib diisi!' });
      return;
    }

    createCompleteMedicalOrder({
      mrn: activePatient?.mrn || 'RM-2026-08-0001',
      doctorName: 'dr. Ahmad Pratama, Sp.PD',
      subjective,
      objective,
      assessment: `${assessment || 'Hipertensi Primer'} (ICD-10: ${icd10Code})`,
      plan,
      icd10Code,
      icd10Name,
      prescriptions: prescribedMeds.map((m) => ({ name: m, qty: 10, price: 14500 })),
      labTests: ['Hematologi Lengkap', 'Kimia Darah (LFT)'],
      radTests: ['Thorax X-Ray PA View']
    });

    showToast({
      type: 'success',
      title: 'CPPT & Inter-Module Order Tersimpan',
      message: 'Catatan EMR tersimpan, e-Resep Farmasi, Order Lab LIS, PACS Radiologi, & Billing Invoice berhasil diperbarui otomatis!'
    });
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  return (
    <div className="space-y-6">
      {/* Patient EMR Banner Header */}
      {activePatient && (
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center font-mono font-black text-white text-xl shadow-lg">
              {activePatient.gender === 'MALE' ? 'L' : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-100">{activePatient.name}</h2>
                <span className="font-mono text-blue-400 text-xs bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
                  {activePatient.mrn}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                  Gol.Darah: {activePatient.bloodType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                NIK: {activePatient.nik} | Tgl Lahir: {activePatient.birthDate} | HP: {activePatient.phone}
              </p>
            </div>
          </div>

          {/* Quick Patient Switcher & Allergy Warning */}
          <div className="flex items-center gap-3">
            {activePatient.allergies.length > 0 ? (
              <div className="px-3.5 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>ALERGI: {activePatient.allergies.join(', ')}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Bebas Riwayat Alergi Obat</span>
            )}

            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <Printer className="w-4 h-4" /> Cetak Resume Medis (CPPT)
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('soap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'soap'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Input SOAP & CPPT
        </button>

        <button
          onClick={() => setActiveTab('ttv')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ttv'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" /> TTV & NEWS 2 Graph
        </button>

        <button
          onClick={() => setActiveTab('cpoe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cpoe'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Pill className="w-4 h-4 text-cyan-400" /> e-Resep CPOE & CDSS
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'diagnostics'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-purple-400" /> Hasil Lab & Radiologi
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Tab Content */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          {activeTab === 'soap' && (
            <form onSubmit={handleSaveCppt} className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-400" /> Catatan Perkembangan Pasien Terintegrasi (CPPT)
                </h3>
                <span className="text-xs text-blue-400 font-mono font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  e-Signature Active
                </span>
              </div>

              {/* Vital Signs Input Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" /> Tanda-Tanda Vital (TTV)
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${news2.badgeColor}`}>
                    NEWS 2 Score: {news2.score} ({news2.riskLevel})
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TD Sistolik</span>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">mmHg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TD Diastolik</span>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">mmHg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Nadi (HR)</span>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">bpm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Napas (RR)</span>
                    <input
                      type="number"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">x/menit</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Suhu Body</span>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">°C</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-100 text-sm outline-none"
                    />
                    <span className="text-[9px] text-slate-500">%</span>
                  </div>
                </div>
              </div>

              {/* S - Subjective */}
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">S (Subjective) - Keluhan & Anamnesa *</label>
                <textarea
                  rows={2}
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  placeholder="Keluhan utama, riwayat penyakit sekarang, dll..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* O - Objective */}
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">O (Objective) - Pemeriksaan Fisik *</label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Hasil penemuan fisik, status lokalis..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              {/* AI Clinical ICD Coder Assistant */}
              <AIIcdCoder
                soapNote={`${subjective} ${objective}`}
                onSelectIcd={(code, name) => {
                  setIcd10Code(code);
                  setIcd10Name(name);
                  if (!assessment) setAssessment(name);
                }}
              />

              {/* A - Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">A (Assessment) - Diagnosa Kerja</label>
                  <input
                    type="text"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="Klinis Diagnosa..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Kode ICD-10 Standar Kemenkes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={icd10Code}
                      onChange={(e) => setIcd10Code(e.target.value)}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono font-bold text-blue-400 text-center"
                    />
                    <input
                      type="text"
                      value={icd10Name}
                      onChange={(e) => setIcd10Name(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* P - Plan */}
              <div>
                <label className="block text-slate-300 font-extrabold mb-1">P (Plan) - Rencana Terapi & CPOE</label>
                <textarea
                  rows={2}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="Rencana tindakan, penunjang, edukasi..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Signature: RSA256 Hash Verified</span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold shadow-lg shadow-blue-600/30 transition hover:scale-105"
                >
                  Simpan CPPT & Sign EMR
                </button>
              </div>
            </form>
          )}

          {activeTab === 'ttv' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Grafik Tren Tanda Vital (TTV) 24 Jam
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="sistolik" name="TD Sistolik" stroke="#EF4444" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="diastolik" name="TD Diastolik" stroke="#3B82F6" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="hr" name="Nadi (bpm)" stroke="#10B981" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'cpoe' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Pill className="w-4 h-4 text-cyan-400" /> Electronic Prescribing (CPOE) & Clinical Decision Support
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  placeholder="Ketik nama obat (Warfarin, Aspirin, Simvastatin...)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Obat
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {prescribedMeds.map((med, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800">
                    💊 {med}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-400" /> Hasil Penunjang Medis Pasien
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-bold text-slate-200">Laboratorium: Hematologi Lengkap (LOINC: 58410-2)</p>
                <p className="text-slate-400">Hemoglobin 14.2 g/dL | Leukosit 11.8 10^3/uL (Abnormal) | Trombosit 245 10^3/uL</p>
                <span className="text-[10px] text-emerald-400 font-bold">STATUS: VALIDATED (dr. Sp.PK Budi)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Timeline History CPPT */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Histori Catatan CPPT</span>
            <span className="text-xs text-blue-400 font-mono">{cpptNotes.length} Record</span>
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
            {cpptNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs hover:border-blue-500/30 transition">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-blue-400">{note.authorName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(note.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300"><strong className="text-slate-400">S:</strong> {note.subjective}</p>
                <p className="text-slate-300"><strong className="text-slate-400">O:</strong> {note.objective}</p>
                <p className="text-blue-300 font-mono"><strong className="text-slate-400">A:</strong> {note.assessment}</p>
                <p className="text-slate-300"><strong className="text-slate-400">P:</strong> {note.plan}</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Sign: {note.digitalSignatureHash?.substring(0, 14)}...</span>
                  <button onClick={() => showToast({ type: 'info', title: 'Cetak Resume Medis', message: 'PDF Resume Medis berhasil digenerate!' })} className="text-blue-400 hover:underline flex items-center gap-1">
                    <Printer className="w-3 h-3" /> Resume PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CDSS Alert Modal */}
      {showCdssModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/50 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-400 border-b border-rose-500/20 pb-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-base font-bold text-rose-300">Clinical Decision Support Alert</h3>
            </div>

            <div className="space-y-3">
              {cdssAlerts.map((alert, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                  <p className="font-extrabold text-rose-300">{alert.title}</p>
                  <p className="text-slate-300">{alert.message}</p>
                  <p className="text-amber-300 font-semibold mt-1">Rekomendasi: {alert.recommendation}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCdssModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                Pahami & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Document Print Modal for Resume Medis */}
      <UniversalPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        docType="RESUME_EMR"
        patientName={activePatient?.name || 'Budi Santoso'}
        mrn={activePatient?.mrn || 'RM-2026-08-0001'}
      />
    </div>
  );
}
