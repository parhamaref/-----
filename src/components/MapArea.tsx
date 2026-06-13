/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Vehicle, MapStyle } from '../types';
import { convertToPersianNumbers, formatPersianSpeed } from '../utils/jalali';
import { 
  Layers, 
  MapPin, 
  Compass, 
  Check, 
  Activity,
  Radio,
  Map,
  Target,
  ZoomIn,
  ZoomOut,
  Globe,
  Navigation,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Sliders,
  Settings,
  ArrowUpRight,
  Train
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
  type: 'city' | 'station' | 'checkpoint';
  elevation?: number; // meters
}

// Bounding box for Golestan Province map projection
const minLat = 36.3;
const maxLat = 37.8;
const minLng = 53.5;
const maxLng = 56.5;

// Golestan boundary outline
const golestanBorderCoords = [
  { lat: 37.4, lng: 53.9 }, 
  { lat: 37.95, lng: 54.0 },
  { lat: 38.15, lng: 55.4 },
  { lat: 37.75, lng: 56.4 },
  { lat: 37.05, lng: 56.2 },
  { lat: 36.75, lng: 55.0 },
  { lat: 36.55, lng: 54.4 },
  { lat: 36.65, lng: 53.8 },
  { lat: 36.85, lng: 53.9 },
];

/**
 * 3D Globe Vector Datasets for continents
 */
const CONTINENTS = [
  // Eurasia and Africa
  [
    { lat: 70, lng: -10 }, { lat: 78, lng: 15 }, { lat: 75, lng: 40 }, { lat: 72, lng: 80 }, { lat: 75, lng: 120 }, { lat: 70, lng: 160 },
    { lat: 60, lng: 170 }, { lat: 55, lng: 160 }, { lat: 45, lng: 140 }, { lat: 35, lng: 140 }, { lat: 25, lng: 120 }, { lat: 10, lng: 108 },
    { lat: 1, lng: 104 }, { lat: -6, lng: 106 }, { lat: -8, lng: 115 }, { lat: -10, lng: 124 }, { lat: -8, lng: 140 }, { lat: 10, lng: 140 },
    { lat: 10, lng: 125 }, { lat: 15, lng: 120 }, { lat: 20, lng: 110 }, { lat: 10, lng: 105 }, { lat: 6, lng: 96 }, { lat: 20, lng: 90 },
    { lat: 10, lng: 78 }, { lat: 8, lng: 77 }, { lat: 22, lng: 68 }, { lat: 25, lng: 58 }, { lat: 15, lng: 55 }, { lat: 12, lng: 44 },
    { lat: 4, lng: 39 }, { lat: -10, lng: 40 }, { lat: -25, lng: 47 }, { lat: -34, lng: 19 }, { lat: -15, lng: 12 }, { lat: 5, lng: 10 },
    { lat: 5, lng: -8 }, { lat: 15, lng: -17 }, { lat: 25, lng: -15 }, { lat: 35, lng: -6 }, { lat: 37, lng: 10 }, { lat: 31, lng: 30 },
    { lat: 30, lng: 34 }, { lat: 25, lng: 34 }, { lat: 20, lng: 37 }, { lat: 12, lng: 43 }, { lat: 15, lng: 50 }, { lat: 30, lng: 48 },
    { lat: 30, lng: 32 }, { lat: 36, lng: 26 }, { lat: 40, lng: 26 }, { lat: 41, lng: 29 }, { lat: 46, lng: 31 }, { lat: 45, lng: 35 },
    { lat: 41, lng: 45 }, { lat: 36, lng: 53 }, { lat: 37, lng: 50 }, { lat: 40, lng: 48 }, { lat: 44, lng: 50 }, { lat: 46, lng: 48 },
    { lat: 55, lng: 35 }, { lat: 60, lng: 20 }, { lat: 65, lng: 15 }, { lat: 70, lng: -10 }
  ],
  // North America
  [
    { lat: 70, lng: -160 }, { lat: 70, lng: -100 }, { lat: 60, lng: -80 }, { lat: 55, lng: -60 }, { lat: 47, lng: -52 }, { lat: 43, lng: -70 },
    { lat: 35, lng: -75 }, { lat: 25, lng: -80 }, { lat: 18, lng: -94 }, { lat: 15, lng: -90 }, { lat: 8, lng: -78 }, { lat: 14, lng: -92 },
    { lat: 20, lng: -105 }, { lat: 24, lng: -110 }, { lat: 33, lng: -118 }, { lat: 45, lng: -124 }, { lat: 54, lng: -130 }, { lat: 60, lng: -145 },
    { lat: 65, lng: -165 }, { lat: 70, lng: -160 }
  ],
  // South America
  [
    { lat: 12, lng: -72 }, { lat: 8, lng: -55 }, { lat: -5, lng: -35 }, { lat: -23, lng: -43 }, { lat: -35, lng: -55 }, { lat: -55, lng: -67 },
    { lat: -45, lng: -74 }, { lat: -30, lng: -72 }, { lat: -15, lng: -75 }, { lat: -5, lng: -81 }, { lat: 5, lng: -77 }, { lat: 12, lng: -72 }
  ],
  // Australia
  [
    { lat: -22, lng: 114 }, { lat: -15, lng: 123 }, { lat: -12, lng: 131 }, { lat: -11, lng: 136 }, { lat: -10, lng: 142 }, { lat: -25, lng: 153 },
    { lat: -38, lng: 146 }, { lat: -37, lng: 140 }, { lat: -34, lng: 115 }, { lat: -22, lng: 114 }
  ],
  // Greenland
  [
    { lat: 80, lng: -60 }, { lat: 83, lng: -30 }, { lat: 80, lng: -10 }, { lat: 70, lng: -20 }, { lat: 60, lng: -43 }, { lat: 65, lng: -52 },
    { lat: 75, lng: -58 }, { lat: 80, lng: -60 }
  ],
  // Antarctica
  [
    { lat: -65, lng: 0 }, { lat: -65, lng: 45 }, { lat: -66, lng: 90 }, { lat: -65, lng: 135 }, { lat: -67, lng: 180 }, { lat: -68, lng: -135 },
    { lat: -72, lng: -90 }, { lat: -70, lng: -45 }, { lat: -65, lng: 0 }
  ]
];

// Global major hubs for transit flight simulation
const GLOBAL_TRANSIT_HUBS = [
  { name: 'پایگاه ترانزیت گرگان', lat: 36.842, lng: 54.433 },
  { name: 'تهران (دپوی ترخیص)', lat: 35.688, lng: 51.389 },
  { name: 'بندر امام خمینی', lat: 30.430, lng: 49.070 },
  { name: 'مسکو (روسیه)', lat: 55.755, lng: 37.617 },
  { name: 'استانبول (ترکیه)', lat: 41.008, lng: 28.978 },
  { name: 'دبی (امارات)', lat: 25.204, lng: 55.270 },
  { name: 'شانگهای (چین)', lat: 31.230, lng: 121.473 },
  { name: 'برلین (آلمان)', lat: 52.520, lng: 13.404 },
  { name: 'لندن (انگلستان)', lat: 51.507, lng: -0.127 },
];

// Projection mapping for 3D Globe
const projectCoordinates = (lat: number, lng: number, rx: number, ry: number, radius: number, cx: number, cy: number) => {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // Cartesian 3D coordinates on Globe Sphere
  const x0 = Math.cos(latRad) * Math.sin(lngRad);
  const y0 = Math.sin(latRad);
  const z0 = Math.cos(latRad) * Math.cos(lngRad);

  // Rotate Y-axis (Yaw)
  const x1 = x0 * Math.cos(ry) - z0 * Math.sin(ry);
  const z1 = x0 * Math.sin(ry) + z0 * Math.cos(ry);
  const y1 = y0;

  // Rotate X-axis (Pitch)
  const x2 = x1;
  const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

  return {
    x: cx + radius * x2,
    y: cy - radius * y2,
    z: z2, // Visible hemisphere when positive (>0)
  };
};

export default function MapArea({ vehicles, selectedVehicle, onSelectVehicle, darkTheme }: MapAreaProps) {
  // Navigation / View modes:
  // '2d-map': detailed interactive tracking maps
  // '3d-globe': simulated rotating 3D Earth space control
  const [viewMode, setViewMode] = useState<'2d-map' | '3d-globe'>('2d-map');
  
  // Custom Google Map styles:
  // 'vector-light': Detailed Google classic map
  // 'vector-dark': Dark tech-radar monitoring
  // 'satellite': Photorealistic Google satellite hybrid
  // 'terrain': High-precision Google elevation contours
  const [mapStyle, setMapStyle] = useState<MapStyle | 'terrain'>('vector-dark');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showRadarPulse, setShowRadarPulse] = useState(true);

  // Overlays filter states
  const [showRailways, setShowRailways] = useState(true);
  const [showSideRoads, setShowSideRoads] = useState(true);
  const [showExpressways, setShowExpressways] = useState(true);
  const [showForests, setShowForests] = useState(true);

  // 2D Map Pan & Zoom states
  const [zoom, setZoom] = useState<number>(1.25);
  const [pan, setPan] = useState({ x: -10, y: -20 });
  
  // Interactive Globe States
  const [globeRx, setGlobeRx] = useState(0.40); // Pitch
  const [globeRy, setGlobeRy] = useState(1.05); // Yaw
  const [isGlobeRotating, setIsGlobeRotating] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map Search Bar and Auto-suggest
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  // Sync darkTheme defaults
  useEffect(() => {
    setMapStyle(darkTheme ? 'vector-dark' : 'vector-light');
  }, [darkTheme]);

  // Automatic slow globe rotation when active
  useEffect(() => {
    if (viewMode !== '3d-globe' || !isGlobeRotating || isDragging) return;
    const interval = setInterval(() => {
      setGlobeRy(prev => (prev + 0.003) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, [viewMode, isGlobeRotating, isDragging]);

  // Drag handlers supporting both 2D panning and 3D globe rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (viewMode === '3d-globe') {
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (viewMode === '3d-globe') {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setGlobeRy(prev => prev + dx * 0.006);
      setGlobeRx(prev => Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, prev - dy * 0.006)));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (viewMode === '3d-globe') return; // Zoom is locked/handled differently for Globe
    const zoomFactor = 1.12;
    setZoom(prev => {
      if (e.deltaY < 0) return Math.min(prev * zoomFactor, 12);
      return Math.max(prev / zoomFactor, 0.45);
    });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.25, 12));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.25, 0.45));
  };

  const handleResetView = () => {
    setZoom(1.25);
    setPan({ x: -10, y: -20 });
    setGlobeRx(0.40);
    setGlobeRy(1.05);
    setIsGlobeRotating(true);
  };

  // Province cities, transit hubs and station positions
  const mapLocations = useMemo<WebCity[]>(() => [
    { name: 'گرگان', lat: 36.842, lng: 54.433, type: 'city', elevation: 155 },
    { name: 'گنبد کاووس', lat: 37.241, lng: 55.162, type: 'city', elevation: 42 },
    { name: 'بندر ترکمن', lat: 36.901, lng: 54.072, type: 'city', elevation: -18 },
    { name: 'علی‌آباد کتول', lat: 36.905, lng: 54.862, type: 'city', elevation: 325 },
    { name: 'کردکوی', lat: 36.792, lng: 54.111, type: 'city', elevation: 110 },
    { name: 'آزادشهر', lat: 37.085, lng: 55.172, type: 'city', elevation: 135 },
    { name: 'بندرگز', lat: 36.772, lng: 53.955, type: 'city', elevation: -14 },
    { name: 'گمیشان', lat: 37.072, lng: 54.075, type: 'city', elevation: -20 },
    { name: 'رامیان', lat: 37.015, lng: 55.132, type: 'city', elevation: 250 },
    { name: 'مینودشت', lat: 37.228, lng: 55.372, type: 'city', elevation: 180 },
    { name: 'اینچه‌برون (پایانه ریلی مرزی)', lat: 37.442, lng: 54.571, type: 'station', elevation: 5 },
    { name: 'گلوگاه (کنترل ترانزیت)', lat: 36.721, lng: 53.805, type: 'checkpoint', elevation: 40 },
    { name: 'تنگه مازندران', lat: 36.420, lng: 54.010, type: 'checkpoint', elevation: 1650 },
  ], []);

  // Map latitude/longitude to SVG viewport space centered on Golestan Province
  const getCoords = (lat: number, lng: number) => {
    // Mercator-like custom linear mapping bound on Golestan
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = 500 - (((lat - minLat) / (maxLat - minLat)) * 420 + 40);
    return { x, y };
  };

  // Convert vehicle positions according to projection
  const mappedVehicles = useMemo(() => {
    return vehicles.map(v => {
      const { x, y } = getCoords(v.lat, v.lng);
      return { ...v, svgX: x, svgY: y };
    });
  }, [vehicles]);

  // Center on newly selected vehicles dynamically in 2D View
  useEffect(() => {
    if (selectedVehicle) {
      if (viewMode === '2d-map') {
        const { x, y } = getCoords(selectedVehicle.lat, selectedVehicle.lng);
        setPan({
          x: 400 - x * zoom,
          y: 250 - y * zoom
        });
      } else {
        // Sphere coordinate tracing: Rotate globe to position the vehicle visibly in the center
        // Vehicles are in Golestan (~37 lat, ~54 lng)
        setGlobeRx(37 * Math.PI / 180);
        setGlobeRy(-54 * Math.PI / 180 + Math.PI / 2);
        setIsGlobeRotating(false);
      }
    }
  }, [selectedVehicle, viewMode]);

  // Convert border coordinates to SVG point string
  const golestanPathPoints = useMemo(() => {
    return golestanBorderCoords.map(c => {
      const p = getCoords(c.lat, c.lng);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
  }, []);

  // Custom search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Check local province locations
    const foundLocation = mapLocations.find(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check vehicles list
    const foundVehicle = vehicles.find(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (v.driver && v.driver.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (foundVehicle) {
      onSelectVehicle(foundVehicle);
      setSearchMessage(`ردیاب پیدا شد: ${foundVehicle.name} (${foundVehicle.driver})`);
    } else if (foundLocation) {
      if (viewMode === '2d-map') {
        const { x, y } = getCoords(foundLocation.lat, foundLocation.lng);
        setPan({
          x: 400 - x * 2.5,
          y: 250 - y * 2.5
        });
        setZoom(2.5);
      }
      setSearchMessage(`موقعیت یافت شد: ${foundLocation.name}`);
    } else {
      setSearchMessage('موقعیتی با این نام در نقشه پیشرفته یافت نشد.');
    }

    setTimeout(() => setSearchMessage(null), 4000);
  };

  /**
   * Theme styles representing the diverse types of Google Maps
   */
  const themeColors = useMemo(() => {
    if (mapStyle === 'satellite') {
      return {
        ambientBg: 'bg-[#0a0f1d]',
        gridColor: 'stroke-white/5',
        svgBg: 'fill-[#070b14]',
        seaBg: 'fill-gradient-ocean-deep fill-[#0d1c33]',
        coastline: 'stroke-teal-800/60',
        landBg: 'fill-[#121c2c]', // Deep forest satellite green tones used next
        plainsBg: 'fill-[#1a2839]', 
        forestBg: 'fill-[#06241a] opacity-70',
        mountainBg: 'fill-[#131d27]',
        mountainStroke: 'stroke-slate-700/30',
        primaryRoad: 'stroke-[#ff9800]',
        primaryRoadCasing: 'stroke-[#3e1f00]',
        sideRoad: 'stroke-[#8c9ba1]/50',
        railwayColor: 'stroke-cyan-400',
        railwayDashSpec: 'stroke-[#0a0f1d]',
        textLabelColor: 'fill-white',
        textLabelAccent: 'fill-cyan-300',
        borderOverlay: 'border-slate-800 bg-slate-950/95 text-slate-100',
        golestanStroke: 'stroke-emerald-400',
        golestanFill: 'fill-emerald-500/10'
      };
    } else if (mapStyle === 'terrain') {
      return {
        ambientBg: 'bg-[#faf6f0]',
        gridColor: 'stroke-amber-900/5',
        svgBg: 'fill-[#fcfbf9]',
        seaBg: 'fill-[#b9e2f5]',
        coastline: 'stroke-[#92cbdf]',
        landBg: 'fill-[#f4eae1]',
        plainsBg: 'fill-[#ebd8c5]',
        forestBg: 'fill-[#d7eacc] opacity-95',
        mountainBg: 'fill-[#e6d0bf]',
        mountainStroke: 'stroke-[#caa183]',
        primaryRoad: 'stroke-[#e28a44]',
        primaryRoadCasing: 'stroke-[#ffffff]',
        sideRoad: 'stroke-[#a9998e]/40',
        railwayColor: 'stroke-[#423d38]',
        railwayDashSpec: 'stroke-[#ffffff]',
        textLabelColor: 'fill-[#3c3732] font-semibold',
        textLabelAccent: 'fill-[#735d46]',
        borderOverlay: 'border-amber-200 bg-white-95 text-[#4a3a29]',
        golestanStroke: 'stroke-amber-600',
        golestanFill: 'fill-amber-700/5'
      };
    } else if (mapStyle === 'vector-light') {
      return {
        ambientBg: 'bg-[#e5e9f0]',
        gridColor: 'stroke-slate-900/5',
        svgBg: 'fill-[#f4f6f9]',
        seaBg: 'fill-[#aad5f6]',
        coastline: 'stroke-[#7bb0e3]',
        landBg: 'fill-[#fcfdfa]',
        plainsBg: 'fill-[#fbf9f4]',
        forestBg: 'fill-[#d8ecd0] opacity-80',
        mountainBg: 'fill-[#ece8e1]',
        mountainStroke: 'stroke-[#ddd7cc]',
        primaryRoad: 'stroke-[#ffbe5b]',
        primaryRoadCasing: 'stroke-[#ffffff]',
        sideRoad: 'stroke-[#dcdcdc]/80',
        railwayColor: 'stroke-[#2e2e2e]',
        railwayDashSpec: 'stroke-[#ffffff]',
        textLabelColor: 'fill-slate-800',
        textLabelAccent: 'fill-primary-600',
        borderOverlay: 'border-slate-200 bg-white/95 text-slate-800',
        golestanStroke: 'stroke-purple-600',
        golestanFill: 'fill-purple-500/5'
      };
    } else { // vector-dark (monitoring theme)
      return {
        ambientBg: 'bg-[#090d16]',
        gridColor: 'stroke-slate-800/40',
        svgBg: 'fill-[#02060f]',
        seaBg: 'fill-[#071324]',
        coastline: 'stroke-blue-900/60',
        landBg: 'fill-[#09111e]',
        plainsBg: 'fill-[#0a1221]',
        forestBg: 'fill-[#041a16] opacity-90',
        mountainBg: 'fill-[#121c2c]',
        mountainStroke: 'stroke-blue-950/40',
        primaryRoad: 'stroke-purple-500/80',
        primaryRoadCasing: 'stroke-transparent',
        sideRoad: 'stroke-slate-800/60',
        railwayColor: 'stroke-emerald-500',
        railwayDashSpec: 'stroke-[#02060f]',
        textLabelColor: 'fill-slate-300',
        textLabelAccent: 'fill-[#8b5cf6]',
        borderOverlay: 'border-slate-800 bg-slate-900/95 text-slate-200',
        golestanStroke: 'stroke-[#a855f7]',
        golestanFill: 'fill-[#a855f7]/5'
      };
    }
  }, [mapStyle]);

  return (
    <div className="flex-1 card overflow-hidden min-h-0 relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800/80 bg-slate-900 shadow-xl select-none" id="advanced-map-control-frame">
      
      {/* Dynamic View Mode Tabs (3D Globe Simulator v 2D Google High Detail Map) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row gap-2 items-stretch justify-between pointer-events-none">
        
        {/* Toggle Switch buttons */}
        <div className="flex items-center p-1 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-lg pointer-events-auto self-start">
          <button
            type="button"
            onClick={() => setViewMode('2d-map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '2d-map' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>نقشه ۲‌بعدی گوگل با ریل و جاده فرعی</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('3d-globe')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '3d-globe' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>شبیه‌ساز کره زمین سه‌بعدی (3D)</span>
          </button>
        </div>

        {/* Google Maps search input inside map */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-lg pointer-events-auto w-full md:w-80">
          <button type="submit" className="text-gray-400 hover:text-primary-500 transition-colors p-1" title="جستجو در نقشه">
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی شهر، ایستگاه باربری یا شناسه ردیاب..."
            className="w-full text-right text-xs bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-400 font-sans"
            dir="rtl"
          />
        </form>
      </div>

      {/* Floating Status Notification messages on search */}
      {searchMessage && (
        <div className="absolute top-18 right-4 z-45 bg-primary-600 text-white text-xs px-4 py-3.5 rounded-xl shadow-2xl font-semibold flex items-center gap-2 animate-bounce max-w-sm text-right" dir="rtl">
          <Sparkles className="w-4.5 h-4.5 flex-shrink-0 text-yellow-300 animate-pulse" />
          <span>{searchMessage}</span>
        </div>
      )}

      {/* Map Interactive Controllers panel (Top Right overlay) */}
      <div className="absolute top-18 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Map view layers trigger */}
        {viewMode === '2d-map' && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="p-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border border-gray-200/80 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center cursor-pointer"
              title="تغییر لایه نقشه گوگل"
            >
              <Layers className="w-5 h-5" />
            </button>

            {showLayerMenu && (
              <div className="absolute top-0 right-13 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-2 w-64 flex flex-col gap-1 z-35 animate-fade-in text-right" dir="rtl">
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 px-2 py-1.5 border-b border-gray-100 dark:border-gray-800/80">نمای نقشه گوگل (Google Maps)</span>
                
                <button
                  type="button"
                  onClick={() => { setMapStyle('vector-light'); setShowLayerMenu(false); }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${mapStyle === 'vector-light' ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                    نقشه کلاسیک گوگل (خیابان و حواشی)
                  </span>
                  {mapStyle === 'vector-light' && <Check className="w-4 h-4 text-primary-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => { setMapStyle('satellite'); setShowLayerMenu(false); }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${mapStyle === 'satellite' ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
                    نقشه ماهواره‌ای گوگل (Google Satellite)
                  </span>
                  {mapStyle === 'satellite' && <Check className="w-4 h-4 text-primary-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => { setMapStyle('terrain'); setShowLayerMenu(false); }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${mapStyle === 'terrain' ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                    نقشه عوارض و ارتفاعات (Google Terrain)
                  </span>
                  {mapStyle === 'terrain' && <Check className="w-4 h-4 text-primary-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => { setMapStyle('vector-dark'); setShowLayerMenu(false); }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${mapStyle === 'vector-dark' ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600"></span>
                    نقشه تاریک مانیتورینگ صیانت
                  </span>
                  {mapStyle === 'vector-dark' && <Check className="w-4 h-4 text-primary-500" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2D Zoom Panel */}
        {viewMode === '2d-map' && (
          <div className="flex flex-col bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border border-gray-200/80 dark:border-gray-800 rounded-xl p-1 gap-1">
            <button 
              type="button"
              onClick={handleZoomIn}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer" 
              title="بزرگ‌نمایی (+)"
            >
              <ZoomIn className="w-4.5 h-4.5" />
            </button>
            <button 
              type="button"
              onClick={handleZoomOut}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer" 
              title="کوچک‌نمایی (-)"
            >
              <ZoomOut className="w-4.5 h-4.5" />
            </button>
            <button 
              type="button"
              onClick={handleResetView}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer border-t border-gray-200/50 dark:border-gray-800/80" 
              title="بازنشانی نمای پیش‌فرض"
            >
              <Target className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

        {/* 3D Globe Speed rotation & toggle control panel */}
        {viewMode === '3d-globe' && (
          <div className="flex flex-col bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border border-gray-200/80 dark:border-gray-800 rounded-xl p-2 gap-2 text-right" dir="rtl">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-1 border-b border-gray-100 dark:border-gray-800 pb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-primary-500 animate-spin-slow" />
              شبیه‌ساز کره
            </span>
            <button
              type="button"
              onClick={() => setIsGlobeRotating(!isGlobeRotating)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center ${
                isGlobeRotating
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
              }`}
            >
              {isGlobeRotating ? 'توقف چرخش خودکار' : 'شروع چرخش جوی'}
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent transition-all text-center cursor-pointer"
            >
              پیش‌فرض
            </button>
          </div>
        )}
      </div>

      {/* Map Infrastructure Layers/Overlays filter panel (Bottom Left Overlay) */}
      {viewMode === '2d-map' && (
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto bg-white/95 dark:bg-gray-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200/80 dark:border-gray-800/90 shadow-xl max-w-[280px] text-right" dir="rtl">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2 mb-2">
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary-500" />
              کنترل لایه‌های جاده‌ای و ریلی گوگل
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Show Railways */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                <span className="inline-block w-6 h-1 border border-dashed border-gray-800 bg-white dark:border-white dark:bg-slate-900 mr-1 rounded-sm"></span>
                خطوط راه‌آهن ترانزیتی استان (ریلی)
              </span>
              <input 
                type="checkbox"
                checked={showRailways}
                onChange={() => setShowRailways(!showRailways)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
              />
            </label>

            {/* Show Side Roads */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                <span className="inline-block w-6 h-0.5 bg-gray-400/80 mr-1"></span>
                جاده‌های فرعی، محلی و روستایی
              </span>
              <input 
                type="checkbox"
                checked={showSideRoads}
                onChange={() => setShowSideRoads(!showSideRoads)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
              />
            </label>

            {/* Show Expressways */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                <span className="inline-block w-6 h-1.5 bg-[#ff9800] dark:bg-purple-500 mr-1 rounded-full"></span>
                بزرگراه‌ها و اتوبان‌های بین‌شهری
              </span>
              <input 
                type="checkbox"
                checked={showExpressways}
                onChange={() => setShowExpressways(!showExpressways)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
              />
            </label>

            {/* Show forest areas */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                <span className="inline-block w-4 h-3 bg-emerald-500/20 border border-emerald-500/40 mr-1 rounded-sm"></span>
                مناطق جنگلی و ذخیره‌گاه‌های طبیعی
              </span>
              <input 
                type="checkbox"
                checked={showForests}
                onChange={() => setShowForests(!showForests)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
              />
            </label>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-1">
            <button 
              type="button"
              onClick={() => setShowRadarPulse(!showRadarPulse)}
              className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors focus:outline-none cursor-pointer"
            >
              <Radio className={`w-3.5 h-3.5 ${showRadarPulse ? 'text-primary-500 animate-pulse' : ''}`} />
              {showRadarPulse ? 'خاموش کردن تنش فرکانسی' : 'روشن کردن تپش رادار'}
            </button>
          </div>
        </div>
      )}

      {/* Selected Vehicle Card Hover Overlay (Top Left overlay) */}
      {selectedVehicle && (
        <div className="absolute top-18 left-4 z-30 bg-white/95 dark:bg-gray-950/98 backdrop-blur-md shadow-2xl border border-gray-200/80 dark:border-gray-800/90 rounded-2xl p-4 w-76 transition-all duration-300 animate-fade-in text-right pointer-events-auto" dir="rtl">
          <div className="flex items-start justify-between mb-3.5 border-b border-gray-100 dark:border-gray-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                selectedVehicle.status === 'moving' ? 'bg-emerald-500 animate-pulse' :
                selectedVehicle.status === 'stopped' ? 'bg-amber-400' : 'bg-gray-400'
              }`}></span>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{selectedVehicle.name}</h4>
            </div>
            
            <button 
              type="button"
              onClick={() => onSelectVehicle(selectedVehicle)} 
              className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-full border border-primary-100 dark:border-primary-800/80 cursor-pointer"
            >
              پایش لایو
            </button>
          </div>
          
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg">
              <span className="text-gray-400">راننده ترانزیت:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{selectedVehicle.driver}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg">
              <span className="text-gray-400">سرعت لحظه‌ای:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{formatPersianSpeed(selectedVehicle.speed)}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg">
              <span className="text-gray-400">مختصات ماهواره:</span>
              <span className="font-mono text-gray-500 dark:text-gray-400 text-[10px]">
                {convertToPersianNumbers(selectedVehicle.lat.toFixed(4))} / {convertToPersianNumbers(selectedVehicle.lng.toFixed(4))}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg">
              <span className="text-gray-400">باتری ردیاب:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {selectedVehicle.battery ? `%${convertToPersianNumbers(selectedVehicle.battery)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg">
              <span className="text-gray-400">لینک سیگنال ردیاب:</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1 text-[10px]">
                {selectedVehicle.satellites ? `${convertToPersianNumbers(selectedVehicle.satellites)} ماهواره` : 'سیگنال عالی'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Infinite Space, Sea and Map Interactive Board with panning and dragging */}
      <div 
        className={`w-full h-full flex-grow relative overflow-hidden ${themeColors.ambientBg} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {viewMode === '2d-map' ? (
          /* ==================== TWO-DIMENSIONAL (2D) HIGH PROFILE MAP ==================== */
          <svg 
            viewBox="0 0 800 500" 
            className={`w-full h-full select-none ${themeColors.svgBg}`}
          >
            {/* Viewport Zooming Panel */}
            <g 
              style={{ 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0'
              }}
              className="transition-transform duration-100 ease-out"
            >
              {/* Infinite sea-water background fill */}
              <rect width="1000" height="700" className={themeColors.svgBg} />

              {/* Caspian Sea (دریای خزر) basin (West boundary) */}
              <polygon
                points="-100,-100 240,-100 160,120 70,260 120,340 50,460 -100,600"
                className={themeColors.seaBg}
              />
              {/* Caspian Sea coast outline */}
              <path
                d="M 240,-100 L 160,120 L 70,260 L 120,340 L 50,460 L -100,600"
                fill="none"
                className={themeColors.coastline}
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />

              {/* Technical radar monitoring Grid (Always render subtle grid lines) */}
              {mapStyle === 'vector-dark' && (
                <g opacity="0.15">
                  <defs>
                    <pattern id="monitoringGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" className="stroke-purple-500" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="1000" height="600" fill="url(#monitoringGrid)" />
                </g>
              )}

              {/* Main Landmass of Golestan, Mazandaran & Iran Border */}
              <path
                d="M 240,-100 L 900,-100 L 920,600 L -100,600 L 50,460 L 120,340 L 70,260 L 160,120 Z"
                className={themeColors.landBg}
              />

              {/* Standard topography terrain details */}
              {showForests && (
                <g>
                  {/* Dense forests (البرز شرقی - ناهارخوران و زرین گل و پارک ملی گلستان) */}
                  <path d="M 120,360 Q 250,400 380,390 T 700,430 L 750,480 L 100,480 Z" className={themeColors.forestBg} />
                  <path d="M 320,360 Q 400,380 480,370 T 620,400 L 640,430 L 280,420 Z" className={themeColors.forestBg} />
                </g>
              )}

              {/* Topographical contour elevation indicators (Google Terrain Layout) */}
              {mapStyle === 'terrain' && (
                <g opacity="0.6">
                  {/* Mountain contour outer ring */}
                  <path d="M 150,450 Q 300,380 500,420 T 750,450" fill="none" className={themeColors.mountainStroke} strokeWidth="1.5" />
                  <path d="M 170,470 Q 300,410 480,440 T 700,470" fill="none" className={themeColors.mountainStroke} strokeWidth="1.5" />
                  {/* Mountain elevations */}
                  <path d="M 520,440 Q 580,420 620,450" fill="none" className={themeColors.mountainStroke} strokeWidth="2" />
                  <text x="560" y="435" className="text-[7px] fill-[#8c745f] font-mono">1500m</text>
                  <text x="320" y="405" className="text-[7px] fill-[#8c745f] font-mono">820m</text>
                </g>
              )}

              {/* Golestan Province Official Highlight Boundary */}
              <polygon
                points={golestanPathPoints}
                className={`${themeColors.golestanFill} ${themeColors.golestanStroke}`}
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />

              {/* Dynamic Map Labels context */}
              <text 
                x="80" 
                y="190" 
                className="text-[10px] font-sans font-bold tracking-widest text-center fill-blue-500/40 dark:fill-blue-400/30"
                textAnchor="middle"
              >
                دریای خزر (دریای مازندران)
              </text>

              {/* Detailed Road, Secondary Access and Railway Systems */}
              <g>
                {/* 1. PRIMARY HIGHWAYS & EXPRESSWAYS (بزرگراه‌ها) */}
                {showExpressways && (
                  <g>
                    {/* highway Route 22 Casing (For clean map style road borders) */}
                    <path
                      d="M 120,340 Q 230,350 310,340 T 520,300 T 680,260"
                      fill="none"
                      className={themeColors.primaryRoadCasing}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Highway Route 22 Core */}
                    <path
                      d="M 120,340 Q 230,350 310,340 T 520,300 T 680,260"
                      fill="none"
                      className={themeColors.primaryRoad}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Regional connection: Incheh Borun Highway Link Casing */}
                    <line
                      x1={getCoords(36.842, 54.433).x} y1={getCoords(36.842, 54.433).y}
                      x2={getCoords(37.442, 54.571).x} y2={getCoords(37.442, 54.571).y}
                      className={themeColors.primaryRoadCasing}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Regional connection: Incheh Borun Highway Link Core */}
                    <line
                      x1={getCoords(36.842, 54.433).x} y1={getCoords(36.842, 54.433).y}
                      x2={getCoords(37.442, 54.571).x} y2={getCoords(37.442, 54.571).y}
                      className={themeColors.primaryRoad}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* 2. SECONDARY SIDE-ROADS & ACCESS ROUTES (جاده‌های فرعی و کوهستانی) */}
                {showSideRoads && (
                  <g opacity="0.80">
                    {/* Scenic forest road to Nahar-Khoran from Gorgan */}
                    <path
                      d="M 310,340 Q 320,380 340,430"
                      fill="none"
                      className={themeColors.sideRoad}
                      strokeWidth="1.6"
                      strokeDasharray="4 2"
                    />
                    {/* Kaboud-val Waterfall access road from Aliabad */}
                    <path
                      d="M 430,335 Q 440,360 460,390"
                      fill="none"
                      className={themeColors.sideRoad}
                      strokeWidth="1.6"
                      strokeDasharray="4 2"
                    />
                    {/* Ramian natural hot spring mountain pass */}
                    <path
                      d="M 510,320 Q 530,350 540,375"
                      fill="none"
                      className={themeColors.sideRoad}
                      strokeWidth="1.5"
                    />
                    {/* Bandar Torkaman to Gomishan port road */}
                    <path
                      d="M 210,300 Q 190,270 200,240"
                      fill="none"
                      className={themeColors.sideRoad}
                      strokeWidth="1.5"
                    />
                    {/* Rural plain links in the north */}
                    <line
                      x1={getCoords(37.241, 55.162).x} y1={getCoords(37.241, 55.162).y}
                      x2={getCoords(37.442, 54.571).x} y2={getCoords(37.442, 54.571).y}
                      className={themeColors.sideRoad}
                      strokeWidth="1.4"
                    />
                  </g>
                )}

                {/* 3. NATIONAL CARGO & TRANSIT RAILWAY SYSTEM (شبکه ریلی مجهز استان) */}
                {showRailways && (
                  <g>
                    {/* High-priority international cargo rail layout */}
                    {/* Under-layer (Dashed white/translucent) */}
                    <path
                      d="M 100,350 L 210,300 L 310,340 L 430,335 L 520,300 L 590,300"
                      fill="none"
                      className={themeColors.railwayDashSpec}
                      strokeWidth="3.2"
                      strokeLinecap="square"
                    />
                    {/* Top-layer (Dashed black/dark block) */}
                    <path
                      d="M 100,350 L 210,300 L 310,340 L 430,335 L 520,300 L 590,300"
                      fill="none"
                      className={themeColors.railwayColor}
                      strokeWidth="2.4"
                      strokeDasharray="7 5"
                      strokeLinecap="square"
                    />

                    {/* Rail Link to Incheh-Borun customs and Turkmenistan */}
                    <path
                      d="M 310,340 Q 280,240 250,180 T 260,110"
                      fill="none"
                      className={themeColors.railwayDashSpec}
                      strokeWidth="3.2"
                      strokeLinecap="square"
                    />
                    <path
                      d="M 310,340 Q 280,240 250,180 T 260,110"
                      fill="none"
                      className={themeColors.railwayColor}
                      strokeWidth="2.4"
                      strokeDasharray="7 5"
                      strokeLinecap="square"
                    />
                  </g>
                )}
              </g>

              {/* Geographic Cities, check-points & rail stations indicators */}
              <g>
                {mapLocations.map((loc, idx) => {
                  const { x, y } = getCoords(loc.lat, loc.lng);
                  const isStation = loc.type === 'station';
                  const isCheckpoint = loc.type === 'checkpoint';

                  return (
                    <g key={idx} className="cursor-pointer group/location">
                      {isStation ? (
                        /* Railway Station icon */
                        <g>
                          <rect x={x - 5} y={y - 5} width="10" height="10" className="fill-cyan-500 stroke-white stroke-2 rounded-sm" />
                          <circle cx={x} cy={y} r="2" className="fill-white" />
                        </g>
                      ) : isCheckpoint ? (
                        /* Police check-point */
                        <polygon
                          points={`${x},${y - 6} ${x - 5},${y + 4} ${x + 5},${y + 4}`}
                          className="fill-amber-500 stroke-white stroke-1"
                        />
                      ) : (
                        /* Provincial City Dot */
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="4.5" 
                          className="fill-white stroke-primary-500 stroke-2 group-hover/location:stroke-primary-600 transition-colors" 
                        />
                      )}

                      {/* Tooltip glow effect */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="14" 
                        className="fill-primary-500/10 opacity-0 group-hover/location:opacity-100 transition-opacity" 
                      />

                      {/* Location text tag with elevation */}
                      <text 
                        x={x} 
                        y={y - 9} 
                        className={`text-[9px] font-sans ${themeColors.textLabelColor} drop-shadow-sm`}
                        textAnchor="middle"
                      >
                        {loc.name}
                      </text>
                      {loc.elevation && (
                        <text
                          x={x}
                          y={y + 13}
                          className="text-[6.5px] font-mono fill-gray-400 dark:fill-gray-500 opacity-0 group-hover/location:opacity-100 transition-opacity"
                          textAnchor="middle"
                        >
                          {convertToPersianNumbers(loc.elevation)}m
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Real-time moving tracker vehicle overlays */}
              <g id="2d-vehicle-markers-layer">
                {mappedVehicles.map((v) => {
                  const isSelected = selectedVehicle && selectedVehicle.id === v.id;
                  const statusColor = v.status === 'moving' ? '#10b981' : v.status === 'stopped' ? '#f59e0b' : '#9ca3af';
                  const markerSize = isSelected ? 12 : 8.5;

                  return (
                    <g 
                      key={v.id} 
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(v);
                      }}
                    >
                      {/* Pulse waves */}
                      {showRadarPulse && (isSelected || v.status === 'moving') && (
                        <circle
                          cx={v.svgX}
                          cy={v.svgY}
                          r={isSelected ? markerSize * 2.8 : markerSize * 1.9}
                          fill="none"
                          stroke={statusColor}
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ transformOrigin: `${v.svgX}px ${v.svgY}px` }}
                          opacity="0.65"
                        />
                      )}

                      {/* Animated vector beacon */}
                      <g className="transition-all duration-300 transform hover:scale-130">
                        <circle
                          cx={v.svgX}
                          cy={v.svgY}
                          r={markerSize}
                          fill={statusColor}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="shadow-xl"
                        />
                        <circle
                          cx={v.svgX}
                          cy={v.svgY}
                          r={markerSize * 0.4}
                          className="fill-white"
                        />
                      </g>

                      {/* Mini identification board standard design */}
                      <g opacity={isSelected ? '1' : '0.8'}>
                        <rect
                          x={v.svgX - 26}
                          y={v.svgY + markerSize + 4}
                          width="52"
                          height="15"
                          rx="4"
                          fill={isSelected ? '#3b82f6' : darkTheme ? '#1e293b' : '#ffffff'}
                          stroke={isSelected ? '#ffffff' : darkTheme ? '#334155' : '#cbd5e1'}
                          strokeWidth="0.8"
                        />
                        <text
                          x={v.svgX}
                          y={v.svgY + markerSize + 14}
                          className="font-bold font-mono text-center"
                          style={{ fontSize: '8px' }}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : darkTheme ? '#f3f4f6' : '#111827'}
                        >
                          {v.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

            </g>
          </svg>
        ) : (
          /* ==================== THREE-DIMENSIONAL (3D) GLOBE SIMULATION ==================== */
          <div className="w-full h-full relative flex items-center justify-center bg-gray-950">
            
            {/* Space background elements (Stars / Nebulas / constellations) */}
            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
              <div className="block absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/5 animate-pulse" />
              <div className="block absolute w-1.5 h-1.5 bg-sky-200 rounded-full top-1/3 left-2/3 animate-pulse duration-700" />
              <div className="block absolute w-0.5 h-0.5 bg-white rounded-full top-3/4 left-1/4" />
              <div className="block absolute w-1 h-1 bg-white rounded-full top-2/3 left-4/5 animate-pulse" />
              <div className="block absolute w-1.5 h-1.5 bg-yellow-100 rounded-full top-1/10 left-3/4 animate-ping duration-1500" />
            </div>

            {/* SVG Globe Renderer with interactive pitch, yaw projection */}
            <svg 
              viewBox="0 0 500 500" 
              className="w-[450px] h-[450px] relative select-none cursor-grab active:cursor-grabbing"
            >
              {/* Star constellation backdrop lines */}
              <line x1="50" y1="80" x2="160" y2="120" stroke="rgba(147, 197, 253, 0.15)" strokeWidth="0.8" />
              <line x1="160" y1="120" x2="110" y2="240" stroke="rgba(147, 197, 253, 0.12)" strokeWidth="0.8" />
              <line x1="400" y1="100" x2="330" y2="60" stroke="rgba(147, 197, 253, 0.15)" strokeWidth="0.8" />

              <g transform="translate(250, 250)">
                
                {/* 1. Deep Space Atmosphere Glow */}
                <defs>
                  <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="#0d1b2a" stopOpacity="1" />
                    <stop offset="90%" stopColor="#1b4965" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#62b6cb" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="globeShadow" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
                  </radialGradient>
                </defs>

                {/* Atmosphere visual ring */}
                <circle r="190" fill="url(#globeGlow)" />
                <circle r="180" fill="#0f172a" />

                {/* Dynamic Rotating 3D Meridians Grid lines */}
                <g opacity="0.25">
                  {/* Latitude rings */}
                  {[-60, -30, 0, 30, 60].map((lat, idx) => {
                    const points = [];
                    for (let lng = -180; lng <= 180; lng += 15) {
                      const p = projectCoordinates(lat, lng, globeRx, globeRy, 180, 0, 0);
                      if (p.z > 0) points.push(`${p.x},${p.y}`);
                    }
                    if (points.length < 2) return null;
                    return <polyline key={idx} points={points.join(' ')} fill="none" stroke="#62b6cb" strokeWidth="0.8" />;
                  })}

                  {/* Longitude rings */}
                  {[-120, -60, 0, 60, 120, 180].map((lng, idx) => {
                    const points = [];
                    for (let lat = -90; lat <= 90; lat += 10) {
                      const p = projectCoordinates(lat, lng, globeRx, globeRy, 180, 0, 0);
                      if (p.z > 0) points.push(`${p.x},${p.y}`);
                    }
                    if (points.length < 2) return null;
                    return <polyline key={idx} points={points.join(' ')} fill="none" stroke="#62b6cb" strokeWidth="0.8" />;
                  })}
                </g>

                {/* 2. Projected Continental Landmasses */}
                <g>
                  {CONTINENTS.map((continent, idx) => {
                    // Segment the polygon coordinates into visible segments
                    const points: string[] = [];
                    let lastVisible = false;

                    continent.forEach(pt => {
                      const proj = projectCoordinates(pt.lat, pt.lng, globeRx, globeRy, 180, 0, 0);
                      if (proj.z > 0) {
                        points.push(`${proj.x},${proj.y}`);
                        lastVisible = true;
                      } else {
                        lastVisible = false;
                      }
                    });

                    if (points.length < 3) return null;

                    return (
                      <polygon
                        key={idx}
                        points={points.join(' ')}
                        className="fill-slate-700/80 stroke-slate-600/40"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>

                {/* 3. Global Shipping & Cargo Flight Arc simulations */}
                <g opacity="0.85">
                  {/* Draw arc connections from Tehran/Gorgan hub to Moscow, Berlin, London, Shanghai, Tokyo */}
                  {GLOBAL_TRANSIT_HUBS.slice(1).map((hub, idx) => {
                    const startProj = projectCoordinates(36.842, 54.433, globeRx, globeRy, 180, 0, 0);
                    const endProj = projectCoordinates(hub.lat, hub.lng, globeRx, globeRy, 180, 0, 0);

                    // Only draw when both cities are on the visible hemisphere
                    if (startProj.z < 0 && endProj.z < 0) return null;

                    // Interpolate bezier control point to construct high flight arches
                    const mx = (startProj.x + endProj.x) / 2;
                    const my = (startProj.y + endProj.y) / 2 - 40; // Shift upward for altitude arch arching

                    return (
                      <g key={idx}>
                        {/* Shimmering Flight line */}
                        <path
                          d={`M ${startProj.x} ${startProj.y} Q ${mx} ${my} ${endProj.x} ${endProj.y}`}
                          fill="none"
                          stroke="rgba(168, 85, 247, 0.65)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        {/* Moving cargo signal along the path */}
                        <circle r="2.5" fill="#facc15" className="animate-pulse">
                          <animateMotion
                            path={`M ${startProj.x} ${startProj.y} Q ${mx} ${my} ${endProj.x} ${endProj.y}`}
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    );
                  })}
                </g>

                {/* 4. Global Hubs Markers on Sphere */}
                <g>
                  {GLOBAL_TRANSIT_HUBS.map((hub, idx) => {
                    const p = projectCoordinates(hub.lat, hub.lng, globeRx, globeRy, 180, 0, 0);
                    if (p.z < 0) return null; // Behind the globe face

                    return (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill={idx === 0 ? "#a855f7" : "#3b82f6"}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          className="text-[8px] font-sans font-bold fill-slate-300 drop-shadow shadow-black"
                          textAnchor="middle"
                        >
                          {hub.name}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* 5. Gorgan-centered fleet projected on Globe */}
                <g>
                  {mappedVehicles.map((v) => {
                    // Global projected spherical coordinate representation base
                    const p = projectCoordinates(v.lat, v.lng, globeRx, globeRy, 180, 0, 0);
                    if (p.z < 0) return null;

                    const isSelected = selectedVehicle && selectedVehicle.id === v.id;
                    const color = v.status === 'moving' ? '#10b981' : '#f59e0b';

                    return (
                      <g 
                        key={v.id} 
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVehicle(v);
                        }}
                      >
                        {/* Selected overlay */}
                        {isSelected && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="11"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        )}

                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? "6" : "4.5"}
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Outer Glassmorphic Shading overlay over the globe core boundary */}
                <circle r="180" fill="url(#globeShadow)" className="pointer-events-none" />

              </g>
            </svg>

            {/* 3D Simulation Controls Helper */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center text-[11px] text-gray-400 max-w-sm mx-auto pointer-events-none" dir="rtl">
              <span className="text-yellow-400 font-bold">💡 راهنمای ناوبری فضا:</span> 
              <span> کره زمین را به صورت ۳‌بعدی با موس بکشید و رها کنید تا بچرخد و موقعیت هاب‌های جهانی و ناوگان ترانزیت استان گلستان را رصد کنید.</span>
            </div>
          </div>
        )}

        {/* Dynamic Telemetry cockpit monitoring indicators (Bottom Right overlay) */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/90 p-3 rounded-2xl text-right max-w-[280px] shadow-xl pointer-events-none flex flex-col gap-1" dir="rtl">
          <div className="flex items-center gap-2 mb-1 border-b border-gray-100 dark:border-gray-800/80 pb-1.5">
            <Activity className="w-4.5 h-4.5 text-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-extrabold text-gray-900 dark:text-white">فرکانس مانیتورینگ صیانت</span>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 font-sans">
            مجموع ردیاب‌های همگام: {convertToPersianNumbers(vehicles.length)} دستگاه
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            پایش فعال موقعیت‌یاب سرتاسری و خطوط مواصلاتی
          </span>
          <div className="text-[9px] font-mono text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800/80 pt-1.5 mt-1 flex justify-between">
            <span>Z-INDEX: TRACE</span>
            <span>UTM: ZONE 39N</span>
          </div>
        </div>

      </div>
    </div>
  );
}
