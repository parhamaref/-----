/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle, MapStyle } from '../types';
import { convertToPersianNumbers, formatPersianSpeed } from '../utils/jalali';
import { 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  MapPin, 
  Compass, 
  Check, 
  Activity,
  Radio
} from 'lucide-react';

interface MapAreaProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  darkTheme: boolean;
}

interface WebCity {
  name: string;
  lat: number;
  lng: number;
  x: number; // calculated vector x
  y: number; // calculated vector y
}

export default function MapArea({ vehicles, selectedVehicle, onSelectVehicle, darkTheme }: MapAreaProps) {
  const [mapStyle, setMapStyle] = useState<MapStyle>('vector-dark');
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showRadarPulse, setShowRadarPulse] = useState(true);

  // Set default map style base on darkTheme
  useEffect(() => {
    setMapStyle(darkTheme ? 'vector-dark' : 'vector-light');
  }, [darkTheme]);

  // Cities coordinates (scaled into Golestan Province boundary box)
  // Lat: 36.6 to 37.4, Lng: 53.8 to 55.4
  const cities = useMemo<WebCity[]>(() => [
    { name: 'گرگان', lat: 36.842, lng: 54.433, x: 250, y: 350 },
    { name: 'علی‌آباد کتول', lat: 36.905, lng: 54.862, x: 420, y: 310 },
    { name: 'آزادشهر', lat: 37.085, lng: 55.172, x: 550, y: 220 },
    { name: 'گنبد کاووس', lat: 37.241, lng: 55.162, x: 540, y: 130 },
    { name: 'بندرگز', lat: 36.772, lng: 53.955, x: 80, y: 390 },
    { name: 'کردکوی', lat: 36.792, lng: 54.111, x: 140, y: 380 },
    { name: 'رامیان', lat: 37.015, lng: 55.132, x: 530, y: 260 },
  ], []);

  // Map latitude/longitude to SVG viewport space dynamically
  const getCoords = (lat: number, lng: number) => {
    // Normalization bounds
    const minLat = 36.6;
    const maxLat = 37.4;
    const minLng = 53.8;
    const maxLng = 55.4;

    const x = ((lng - minLng) / (maxLng - minLng)) * 750 + 50;
    const y = 500 - (((lat - minLat) / (maxLat - minLat)) * 400 + 50);
    return { x, y };
  };

  // Convert SVG coordinates back to responsive bounds
  const mappedVehicles = useMemo(() => {
    return vehicles.map(v => {
      const { x, y } = getCoords(v.lat, v.lng);
      return {
        ...v,
        svgX: x,
        svgY: y
      };
    });
  }, [vehicles]);

  const activeSelectedCoords = useMemo(() => {
    if (!selectedVehicle) return null;
    return getCoords(selectedVehicle.lat, selectedVehicle.lng);
  }, [selectedVehicle]);

  // Center on selected vehicle with smooth pan
  useEffect(() => {
    if (activeSelectedCoords) {
      setPan({
        x: 400 - activeSelectedCoords.x * zoom,
        y: 250 - activeSelectedCoords.y * zoom
      });
    }
  }, [selectedVehicle, zoom]);

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const handleReset = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  // SVG Theme styling
  const svgTheme = useMemo(() => {
    const isDark = mapStyle === 'vector-dark' || mapStyle === 'satellite';
    return {
      bg: isDark ? 'fill-gray-950' : 'fill-slate-50',
      water: isDark ? 'fill-blue-950/80 stroke-blue-900/40' : 'fill-blue-100 stroke-blue-200',
      grid: isDark ? 'stroke-gray-800/60' : 'stroke-gray-200/60',
      roadPrimary: isDark ? 'stroke-blue-500/20' : 'stroke-blue-200',
      roadPrimaryGlow: isDark ? 'stroke-blue-500/40' : 'stroke-blue-300',
      roadSecondary: isDark ? 'stroke-gray-800' : 'stroke-gray-100',
      provinceBorder: isDark ? 'stroke-purple-500/30' : 'stroke-purple-300',
      gridText: isDark ? 'fill-gray-600' : 'fill-gray-400'
    };
  }, [mapStyle]);

  return (
    <div className="flex-1 card overflow-hidden min-h-0 relative flex flex-col">
      {/* Map Control Bar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl p-1 gap-1">
          <button 
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" 
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" 
            title="کوچک‌نمایی"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" 
            title="تنظیم مجدد"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Styles Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center"
            title="نوع نقشه"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute top-0 right-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-2 w-48 flex flex-col gap-1 z-30">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 px-2 py-1 block text-right border-b border-gray-100 dark:border-gray-800">نوع لایه</span>
              <button
                type="button"
                onClick={() => { setMapStyle('vector-dark'); setShowLayerMenu(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs text-right transition-colors ${mapStyle === 'vector-dark' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <span>برداری تاریک (کنترل)</span>
                {mapStyle === 'vector-dark' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => { setMapStyle('vector-light'); setShowLayerMenu(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs text-right transition-colors ${mapStyle === 'vector-light' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <span>برداری روشن</span>
                {mapStyle === 'vector-light' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => { setMapStyle('grid'); setShowLayerMenu(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs text-right transition-colors ${mapStyle === 'grid' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <span>جدول شبکه‌ای فنی</span>
                {mapStyle === 'grid' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Status Indicators Legend */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5 mb-1 text-right">
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary-500 animate-spin-slow" />
              راهنمای مانیتورینگ
            </span>
          </div>
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full inline-block ring-2 ring-emerald-500/20 shadow"></span>
              <span className="text-gray-600 dark:text-gray-300">در حرکت (فعال)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-amber-500 rounded-full inline-block ring-2 ring-amber-500/20 shadow"></span>
              <span className="text-gray-600 dark:text-gray-300">متوقف (سوییچ باز)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-gray-400 rounded-full inline-block ring-2 ring-gray-400/20 shadow"></span>
              <span className="text-gray-600 dark:text-gray-300">غیرفعال (آفلاین)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-2 mt-1">
            <button 
              type="button"
              onClick={() => setShowRadarPulse(!showRadarPulse)}
              className="flex items-center gap-1 text-[9px] text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors focus:outline-none"
            >
              <Radio className={`w-3 h-3 ${showRadarPulse ? 'text-primary-500 animate-pulse' : ''}`} />
              {showRadarPulse ? 'تعلیق سیگنال رادار تپشی' : 'نمایش امواج رادار'}
            </button>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Card Hover Overlay */}
      {selectedVehicle && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-200 dark:border-gray-800 rounded-2xl p-4 w-72 transition-all duration-300 animate-fade-in text-right">
          <div className="flex items-start justify-between mb-2">
            <button 
              type="button"
              onClick={() => onSelectVehicle(selectedVehicle)} // Toggle card details modal 
              className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-full border border-primary-100 dark:border-primary-800"
            >
              پایش لایو
            </button>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">{selectedVehicle.name}</h4>
              <span className={`h-2 w-2 rounded-full ${
                selectedVehicle.status === 'moving' ? 'bg-emerald-500' :
                selectedVehicle.status === 'stopped' ? 'bg-amber-400' : 'bg-gray-400'
              }`}></span>
            </div>
          </div>
          
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-lg">
              <span className="font-mono text-gray-800 dark:text-gray-200">{selectedVehicle.driver}</span>
              <span className="text-gray-400">راننده:</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-lg">
              <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{formatPersianSpeed(selectedVehicle.speed)}</span>
              <span className="text-gray-400">سرعت لحظه‌ای:</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-lg">
              <span className="font-mono text-gray-800 dark:text-gray-200">
                {selectedVehicle.battery ? `%${convertToPersianNumbers(selectedVehicle.battery)}` : '—'}
              </span>
              <span className="text-gray-400">باتری ردیاب:</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-lg">
              <span className="font-mono text-gray-800 dark:text-gray-200">
                {selectedVehicle.satellites ? `${convertToPersianNumbers(selectedVehicle.satellites)} ماهواره` : '—'}
              </span>
              <span className="text-gray-400">موقعیت‌یابی GPS:</span>
            </div>
          </div>
        </div>
      )}

      {/* SVG Vector Interactive Map container */}
      <div 
        className={`w-full h-full flex-grow relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} overflow-hidden`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          viewBox="0 0 800 500" 
          className={`w-full h-full select-none transition-transform duration-100 ${svgTheme.bg}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Grid Background pattern */}
          {mapStyle === 'grid' && (
            <g>
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="stroke-gray-800/40" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#gridPattern)" />
              {/* Vertical coordinates */}
              <text x="50" y="490" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LONG. 53.8° E</text>
              <text x="350" y="490" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LONG. 54.4° E</text>
              <text x="650" y="490" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LONG. 55.0° E</text>

              <text x="730" y="50" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LAT. 37.4° N</text>
              <text x="730" y="250" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LAT. 37.0° N</text>
              <text x="730" y="450" className={svgTheme.gridText} fontSize="8" fontFamily="monospace">LAT. 36.6° N</text>
            </g>
          )}

          {/* Caspian Sea (دریای خزر) outline vector on the left */}
          <path 
            d="M 0 100 Q 40 180 30 250 T 0 420 L 0 500 L 0 0 L 0 100 Z" 
            className={svgTheme.water}
            strokeWidth="1.5"
          />
          <text 
            x="20" 
            y="200" 
            className="text-[12px] font-bold fill-blue-300 dark:fill-blue-900/60 rotate-90 Origin-center font-sans tracking-widest text-center"
          >
            دریای خزر (کاسپین)
          </text>

          {/* Major highway interconnects (شبکه راه‌ها) */}
          <g opacity="0.85">
            {/* Highway Gorgan to Gonbad via Aliabad and Azadshahr */}
            <path 
              d="M 80 390 L 140 380 L 250 350 L 420 310 L 530 260 L 550 220 L 540 130" 
              fill="none" 
              className={svgTheme.roadPrimaryGlow}
              strokeWidth="6" 
              strokeLinecap="round"
            />
            <path 
              d="M 80 390 L 140 380 L 250 350 L 420 310 L 530 260 L 550 220 L 540 130" 
              fill="none" 
              className={svgTheme.roadPrimary}
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeDasharray="4 3" 
            />

            {/* Other routes */}
            <path 
              d="M 250 350 Q 300 250 540 130" 
              fill="none" 
              className={svgTheme.roadSecondary}
              strokeWidth="1.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M 420 310 Q 480 350 530 260" 
              fill="none" 
              className={svgTheme.roadSecondary}
              strokeWidth="1" 
            />
          </g>

          {/* Grid lines in background vector style */}
          {mapStyle !== 'grid' && (
            <g opacity="0.2">
              <line x1="100" y1="0" x2="100" y2="500" className={svgTheme.grid} strokeWidth="0.5" />
              <line x1="300" y1="0" x2="300" y2="500" className={svgTheme.grid} strokeWidth="0.5" />
              <line x1="500" y1="0" x2="500" y2="500" className={svgTheme.grid} strokeWidth="0.5" />
              <line x1="700" y1="0" x2="700" y2="500" className={svgTheme.grid} strokeWidth="0.5" />

              <line x1="0" y1="100" x2="800" y2="100" className={svgTheme.grid} strokeWidth="0.5" />
              <line x1="0" y1="250" x2="800" y2="250" className={svgTheme.grid} strokeWidth="0.5" />
              <line x1="0" y1="400" x2="800" y2="400" className={svgTheme.grid} strokeWidth="0.5" />
            </g>
          )}

          {/* City Nodes */}
          <g>
            {cities.map((city, idx) => (
              <g key={idx} className="cursor-help group/city">
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r="5" 
                  className="fill-white stroke-primary-500 dark:stroke-primary-400 stroke-2" 
                />
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r="12" 
                  className="fill-primary-500/10 opacity-0 group-hover/city:opacity-100 transition-opacity" 
                />
                <text 
                  x={city.x} 
                  y={city.y - 12} 
                  className="text-[9px] font-sans font-bold fill-gray-800 dark:fill-gray-300 drop-shadow shadow-black text-center"
                  textAnchor="middle"
                >
                  {city.name}
                </text>
              </g>
            ))}
          </g>

          {/* Real-time Vehicle Markers on map */}
          <g>
            {mappedVehicles.map((v) => {
              const isSelected = selectedVehicle && selectedVehicle.id === v.id;
              const statusColor = v.status === 'moving' ? '#10b981' : v.status === 'stopped' ? '#f59e0b' : '#9ca3af';
              
              return (
                <g 
                  key={v.id} 
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVehicle(v);
                  }}
                >
                  {/* Radar pulse around selected / moving vehicle */}
                  {showRadarPulse && (isSelected || v.status === 'moving') && (
                    <circle
                      cx={v.svgX}
                      cy={v.svgY}
                      r="18"
                      fill="none"
                      stroke={statusColor}
                      strokeWidth="1.5"
                      className="animate-ping"
                      style={{ transformOrigin: `${v.svgX}px ${v.svgY}px` }}
                      opacity="0.6"
                    />
                  )}

                  {/* Marker Pin */}
                  <g className="transition-all duration-300 transform hover:scale-125">
                    <circle
                      cx={v.svgX}
                      cy={v.svgY}
                      r={isSelected ? '10' : '7.5'}
                      fill={statusColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="shadow-md"
                    />
                    
                    {/* Inner core */}
                    {v.status === 'moving' && (
                      <circle
                        cx={v.svgX}
                        cy={v.svgY}
                        r="3"
                        fill="white"
                      />
                    )}
                  </g>

                  {/* Vehicle Label tag */}
                  <g opacity={isSelected ? '1' : '0.75'}>
                    <rect
                      x={v.svgX - 25}
                      y={v.svgY + 12}
                      width="50"
                      height="12"
                      rx="3"
                      fill={isSelected ? '#2563eb' : darkTheme ? '#1e293b' : '#ffffff'}
                      stroke={isSelected ? '#ffffff' : darkTheme ? '#334155' : '#cbd5e1'}
                      strokeWidth="0.5"
                    />
                    <text
                      x={v.svgX}
                      y={v.svgY + 21}
                      className={`text-[8px] text-center font-semibold font-mono ${isSelected ? 'fill-white' : darkTheme ? 'fill-gray-300' : 'fill-gray-800'}`}
                      textAnchor="middle"
                    >
                      {v.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating live feed alert system simulation */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-2.5 rounded-xl text-right max-w-xs shadow-lg flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">فرکانس پایش ماهواره‌ای</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">موقعیت‌یابی فعال برای {convertToPersianNumbers(vehicles.filter(v => v.status === 'moving').length)} ردیاب در حال حرکت</span>
          </div>
        </div>
      </div>
    </div>
  );
}
