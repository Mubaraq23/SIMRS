'use client';

import React, { useState } from 'react';
import {
  ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sliders,
  RotateCw,
  Sun,
  Eye,
  Ruler,
  Grid,
  FileText,
  Save,
  Printer,
  CheckCircle2,
  Layers,
  Sparkles,
  Move,
  Plus,
  FilePlus
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';
import { PacsStudy } from '@/types/simrs';

export default function RadiologiPage() {
  const { pacsStudies, activePacsStudy, setActivePacsStudy, addPacsStudy, patients, addBillingItemToPatient, addSatusehatLog } = useHospitalStore();
  const { showToast } = useToast();

  const [selectedStudy, setSelectedStudy] = useState(activePacsStudy || pacsStudies[0]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [windowPreset, setWindowPreset] = useState<'STANDARD' | 'BONE' | 'SOFT_TISSUE' | 'INVERT'>('STANDARD');
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '1x2'>('1x1');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [findingsText, setFindingsText] = useState(
    selectedStudy?.findings || 'Cor tak membesar, CTR < 50%. Pulmo: tampak infiltrat di lobus kanan bawah.'
  );
  const [impressionText, setImpressionText] = useState(
    selectedStudy?.impression || 'Gambaran Bronkopneumonia Lobus Dextra. Cardiomegaly (-).'
  );
  const [showInputModal, setShowInputModal] = useState(false);

  // Form Input DICOM Baru
  const [selectedMrn, setSelectedMrn] = useState(patients[0]?.mrn || 'RM-2026-08-0001');
  const [modality, setModality] = useState<'CT-SCAN' | 'MRI' | 'X-RAY' | 'ULTRASOUND'>('CT-SCAN');
  const [bodyPart, setBodyPart] = useState('Thorax PA & Head Scan');
  const [radiologistName, setRadiologistName] = useState('dr. Maya Sp.Rad');
  const [inputFindings, setInputFindings] = useState('Tampak lesi hiperdens di area lobus dextra.');
  const [inputImpression, setImpressionInput] = useState('Suspect Hematoma Lobus Dextra.');

  const handleSaveReport = () => {
    showToast({
      type: 'success',
      title: 'Hasil Examination Disimpan',
      message: `Expertise Radiologi untuk ${selectedStudy.patientName} (${selectedStudy.mrn}) berhasil divalidasi!`
    });
  };

  const handleCreateNewDicomStudy = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.mrn === selectedMrn) || patients[0];

    const newStudy: PacsStudy = {
      id: `pacs-${Date.now()}`,
      radOrderId: `rad-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientObj.name,
      mrn: patientObj.mrn,
      modality,
      bodyPart,
      studyDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dicomFrames: ['/dicom/scan1.jpg'],
      status: 'REPORTED',
      findings: inputFindings,
      impression: inputImpression,
      radiologistName
    };

    // 1. Save to PACS store
    addPacsStudy(newStudy);
    setSelectedStudy(newStudy);
    setFindingsText(inputFindings);
    setImpressionText(inputImpression);

    // 2. Interconnect with Billing Invoice
    const radAmount = modality === 'CT-SCAN' ? 1200000 : modality === 'MRI' ? 2500000 : 350000;
    addBillingItemToPatient(patientObj.mrn, {
      description: `Radiologi ${modality}: ${bodyPart}`,
      category: 'Penunjang Rad',
      amount: radAmount
    });

    // 3. Interconnect with SATUSEHAT FHIR Telemetry
    addSatusehatLog({
      id: `sat-${Date.now()}`,
      resourceType: 'DiagnosticReport',
      resourceId: newStudy.id,
      satusehatId: `SS-RAD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SUCCESS',
      syncTime: new Date().toLocaleString('id-ID'),
      httpCode: 201
    });

    setShowInputModal(false);
    showToast({
      type: 'success',
      title: 'PACS Study Ter-Input!',
      message: `Hasil Radiologi ${modality} untuk ${patientObj.name} disimpan! Tagihan Billing & SATUSEHAT tersinkronisasi.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Radiology Page Top KPI Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total PACS Studies</span>
            <p className="text-2xl font-black text-blue-400 font-mono">{pacsStudies.length} Exam</p>
            <span className="text-[10px] text-slate-400">CT: 28 | MRI: 14 | X-Ray: 100</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Expertise</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">100% Reported</p>
            <span className="text-[10px] text-emerald-400">Terbaca & Valid</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Integrasi Modality</span>
            <p className="text-2xl font-black text-indigo-400 font-mono">DICOM 3.0</p>
            <span className="text-[10px] text-indigo-400">Worklist SCU Connected</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Waktu Baca Rata-Rata</span>
            <p className="text-2xl font-black text-purple-400 font-mono">12 Menit</p>
            <span className="text-[10px] text-purple-400">SLA Radiolog Cepat</span>
          </div>
        </div>
      </div>

      {/* Main DICOM PACS Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: DICOM Studies Patient Selector List */}
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
              Antrean DICOM PACS
            </h3>
            <button
              onClick={() => setShowInputModal(true)}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              title="Input Expertise / DICOM Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {pacsStudies.map((study) => {
              const isSelected = selectedStudy.id === study.id;
              return (
                <button
                  key={study.id}
                  onClick={() => {
                    setSelectedStudy(study);
                    setFindingsText(study.findings || '');
                    setImpressionText(study.impression || '');
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{study.patientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                      {study.modality}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">RM: {study.mrn}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{study.bodyPart}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle 2 Cols: DICOM Interactive Full Canvas Viewer */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          {/* Professional DICOM Toolbar */}
          <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] px-2 text-blue-400 font-bold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(250, z + 15))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Window Presets */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setWindowPreset('STANDARD')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  windowPreset === 'STANDARD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setWindowPreset('BONE')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  windowPreset === 'BONE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CT Bone
              </button>
              <button
                onClick={() => setWindowPreset('INVERT')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  windowPreset === 'INVERT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Invert
              </button>
            </div>

            {/* Grid & Tools */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setIsMeasuring(!isMeasuring)}
                className={`p-1.5 rounded-lg transition ${
                  isMeasuring ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Measurement Tool"
              >
                <Ruler className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridLayout(gridLayout === '1x1' ? '2x2' : '1x1')}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition"
                title="Grid Layout Split"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DICOM Viewer Canvas Stage */}
          <div className="relative flex-1 bg-black rounded-2xl border border-slate-800 min-h-[400px] flex items-center justify-center overflow-hidden p-4">
            {/* DICOM Header Overlay Info */}
            <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-cyan-400 space-y-0.5 bg-black/60 p-2 rounded-xl backdrop-blur">
              <p className="font-bold">{selectedStudy.patientName}</p>
              <p>RM: {selectedStudy.mrn}</p>
              <p>Modality: {selectedStudy.modality} - {selectedStudy.bodyPart}</p>
            </div>

            {/* Measurement Line Overlay Mockup */}
            {isMeasuring && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                <div className="relative w-48 h-0.5 bg-yellow-400">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-yellow-500 text-black px-2 py-0.5 rounded">
                    42.8 mm
                  </span>
                </div>
              </div>
            )}

            {/* DICOM Visual Representation */}
            <div
              className={`transition-all duration-200 flex items-center justify-center ${
                windowPreset === 'INVERT' ? 'invert' : ''
              } ${windowPreset === 'BONE' ? 'contrast-200 brightness-125' : ''}`}
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div className="w-72 h-80 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-black border border-slate-700/60 shadow-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                <ImageIcon className="w-24 h-24 text-slate-500 animate-pulse" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-400 block">[ DICOM CANVAS FRAME 1/12 ]</span>
                  <span className="text-[10px] text-slate-400 block">Slice Thickness: 1.25mm | W: 350 L: 40</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Radiologist Expertise Report Form */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Form Expertise Radiologi</span>
              <span className="text-[10px] text-emerald-400 font-bold">{selectedStudy.radiologistName || 'dr. Maya Sp.Rad'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Temuan (Findings):</label>
                <textarea
                  rows={4}
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Kesan (Impression):</label>
                <textarea
                  rows={3}
                  value={impressionText}
                  onChange={(e) => setImpressionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleSaveReport}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan & Validasi Expertise PACS
            </button>
          </div>
        </div>
      </div>

      {/* Modal Input DICOM Radiology Baru */}
      {showInputModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" /> Input Expertise PACS Radiologi Baru
              </h3>
              <button onClick={() => setShowInputModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewDicomStudy} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Pasien Terdaftar *</label>
                <select
                  value={selectedMrn}
                  onChange={(e) => setSelectedMrn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-semibold cursor-pointer outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.mrn} className="bg-slate-900 text-slate-100">
                      {p.name} ({p.mrn}) - NIK: {p.nik}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Modality Radiologi</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-mono cursor-pointer outline-none"
                  >
                    <option value="CT-SCAN">CT-SCAN</option>
                    <option value="MRI">MRI</option>
                    <option value="X-RAY">X-RAY</option>
                    <option value="ULTRASOUND">ULTRASOUND (USG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Organ / Body Part</label>
                  <input
                    type="text"
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Temuan (Findings)</label>
                <textarea
                  rows={2}
                  value={inputFindings}
                  onChange={(e) => setInputFindings(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Kesan (Impression)</label>
                <textarea
                  rows={2}
                  value={inputImpression}
                  onChange={(e) => setImpressionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-lg shadow-blue-600/30"
                >
                  Simpan Expertise PACS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
