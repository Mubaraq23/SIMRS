'use client';

import React, { useState } from 'react';
import { Activity, Wifi, CheckCircle2, AlertCircle, Code, RefreshCw, Send } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { transformPatientToFhir, transformEncounterToFhir, transformConditionToFhir } from '@/lib/satusehat/fhir-transformer';
import { useToast } from '@/components/ui/ToastProvider';

export default function SatusehatPage() {
  const { activePatient, satusehatLogs, addSatusehatLog } = useHospitalStore();
  const { showToast } = useToast();
  const [selectedResourceType, setSelectedResourceType] = useState<'Patient' | 'Encounter' | 'Condition'>('Patient');
  const [isSyncing, setIsSyncing] = useState(false);

  // Generate FHIR Payload Preview
  const fhirPayload =
    selectedResourceType === 'Patient' && activePatient
      ? transformPatientToFhir(activePatient)
      : selectedResourceType === 'Encounter'
      ? transformEncounterToFhir('enc-101', 'P-1000982', 'N100234', 'Poliklinik Penyakit Dalam')
      : transformConditionToFhir('ENC-887123', 'P-1000982', 'I10', 'Essential (primary) hypertension');

  const handleSyncKemenkes = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newSatId = `SS-FHIR-${Math.floor(100000 + Math.random() * 900000)}`;
      addSatusehatLog({
        id: `sat-${Date.now()}`,
        resourceType: selectedResourceType,
        resourceId: activePatient?.id || 'res-101',
        satusehatId: newSatId,
        status: 'SUCCESS',
        syncTime: new Date().toLocaleString('id-ID'),
        httpCode: 201
      });
      showToast({
        type: 'success',
        title: 'SATUSEHAT FHIR Sync Success',
        message: `Resource ${selectedResourceType} tersinkronisasi (ID: ${newSatId}) - HTTP 201 Created`
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top SATUSEHAT KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Connection Gateway</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">ONLINE</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Production OAuth2 Ready</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FHIR R4 Resources Mapped</span>
          <p className="text-2xl font-black text-blue-400 font-mono">3.421 Rec</p>
          <span className="text-[10px] text-blue-400 font-semibold">Patient, Encounter, Condition</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Akurasi Mapping</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">99.8%</p>
          <span className="text-[10px] text-indigo-400 font-semibold">KARS & Kemenkes Standard</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latency API Response</span>
          <p className="text-2xl font-black text-purple-400 font-mono">145 ms</p>
          <span className="text-[10px] text-purple-400 font-semibold">Ultra Fast Sync</span>
        </div>
      </div>

      {/* Main SATUSEHAT Bridge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: FHIR R4 JSON Inspector */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-extrabold text-slate-100">FHIR R4 JSON Resource Mapper</h3>
            </div>

            {/* Resource Type Selector */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
              {(['Patient', 'Encounter', 'Condition'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedResourceType(type)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    selectedResourceType === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* JSON Inspector View */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-blue-300 shadow-inner">
            <pre className="overflow-x-auto max-h-96">{JSON.stringify(fhirPayload, null, 2)}</pre>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSyncKemenkes}
              disabled={isSyncing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Sync ke SATUSEHAT API</span>
            </button>
          </div>
        </div>

        {/* Right Col: Sync Telemetry Log */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Log Telemetri Transaksi</span>
            <span className="text-xs text-blue-400 font-mono font-bold">{satusehatLogs.length} Log</span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {satusehatLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 hover:border-blue-500/30 transition">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-blue-400">{log.resourceType}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold">
                    HTTP {log.httpCode}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] font-mono">ID: {log.satusehatId}</p>
                <span className="text-[10px] text-slate-500 font-mono block">{log.syncTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
