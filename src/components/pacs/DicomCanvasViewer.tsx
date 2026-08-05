'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Move,
  Sun,
  Ruler,
  RotateCcw,
  Maximize2,
  Sliders,
  Layers,
  FileText,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import { PacsStudy } from '@/types/simrs';

interface Props {
  study: PacsStudy;
}

export default function DicomCanvasViewer({ study }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [activeTool, setActiveTool] = useState<'PAN' | 'ZOOM' | 'MEASURE' | 'LEVEL'>('PAN');
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Draw DICOM Simulated Image onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Filter / Contrast / Brightness
    let filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (isInverted) filterString += ' invert(100%)';
    ctx.filter = filterString;

    // Draw Dark Medical Background
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, width, height);

    // Draw Simulated Anatomical Scan (Thorax X-Ray / CT)
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Simulated Chest Cage & Lungs
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 160, 200, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Left Lung Field (Darker Density)
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.ellipse(width / 2 - 65, height / 2 - 10, 55, 120, 0.1, 0, 2 * Math.PI);
    ctx.fill();

    // Right Lung Field with Infiltrate Simulation
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath();
    ctx.ellipse(width / 2 + 65, height / 2 - 10, 55, 120, -0.1, 0, 2 * Math.PI);
    ctx.fill();

    // Infiltrate (White opacity patch)
    ctx.fillStyle = 'rgba(240, 240, 245, 0.55)';
    ctx.beginPath();
    ctx.arc(width / 2 + 60, height / 2 + 40, 35, 0, 2 * Math.PI);
    ctx.fill();

    // Heart Shadow (Cardiac Silhouette)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(width / 2 - 25, height / 2 + 30, 60, 80, 0.4, 0, 2 * Math.PI);
    ctx.fill();

    // Spine & Rib Grids
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    for (let y = height / 2 - 140; y <= height / 2 + 140; y += 30) {
      ctx.beginPath();
      ctx.moveTo(width / 2 - 140, y);
      ctx.quadraticCurveTo(width / 2, y + 15, width / 2 + 140, y);
      ctx.stroke();
    }

    // Spine Column
    ctx.fillStyle = '#64748b';
    ctx.fillRect(width / 2 - 12, height / 2 - 160, 24, 320);

    ctx.restore();

    // Draw HUD Annotations
    ctx.font = '11px monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText(`PATIENT: ${study.patientName.toUpperCase()}`, 15, 25);
    ctx.fillText(`MRN: ${study.mrn}`, 15, 42);
    ctx.fillText(`MODALITY: ${study.modality} (${study.bodyPart})`, 15, 59);

    ctx.fillStyle = '#a855f7';
    ctx.fillText(`WW/WL: ${contrast}/${brightness}`, width - 150, 25);
    ctx.fillText(`ZOOM: ${(zoom * 100).toFixed(0)}%`, width - 150, 42);
    ctx.fillText(`DICOM ID: ${study.id}`, width - 150, 59);

    if (measuredDistance) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 + 25, height / 2 + 40);
      ctx.lineTo(width / 2 + 95, height / 2 + 40);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`LENGTH: ${measuredDistance} mm`, width / 2 + 30, height / 2 + 35);
    }
  }, [study, zoom, brightness, contrast, isInverted, measuredDistance]);

  const handleReset = () => {
    setZoom(1.0);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
    setMeasuredDistance(null);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-4 shadow-2xl">
      {/* DICOM Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3.0))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Zoom +</span>
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Zoom -</span>
          </button>
          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 border transition ${
              isInverted ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Sun className="w-4 h-4 text-indigo-300" />
            <span>Invert</span>
          </button>
          <button
            onClick={() => setMeasuredDistance(measuredDistance ? null : 42.5)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 border transition ${
              measuredDistance ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Ruler className="w-4 h-4 text-rose-300" />
            <span>Ukur (mm)</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Contrast & Brightness Sliders */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Kontras:</span>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-24 accent-teal-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Kecerahan:</span>
            <input
              type="range"
              min="50"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-24 accent-teal-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* DICOM HTML5 Canvas Container */}
      <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 flex justify-center items-center shadow-inner">
        <canvas ref={canvasRef} width={640} height={480} className="w-full max-h-[500px] object-contain cursor-crosshair" />
        
        {/* Modality Stamp Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-mono text-teal-400 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>DICOM Web Standard (PACS Ready)</span>
        </div>
      </div>
    </div>
  );
}
