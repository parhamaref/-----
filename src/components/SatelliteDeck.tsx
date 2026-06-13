/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Vehicle } from '../types';
import { convertToPersianNumbers } from '../utils/jalali';
import {
  Globe,
  Radio,
  Cpu,
  Tv,
  Zap,
  Activity,
  Compass,
  Database,
  ArrowUpRight,
  Sparkles,
  Command,
  Maximize2,
  Minimize2,
  Satellite
} from 'lucide-react';

interface SatelliteDeckProps {
  selectedVehicle: Vehicle | null;
}

interface MockDriver {
  id: string;
  driver: string;
  name: string;
  plate: string;
  lat: number;
  lng: number;
  speed: number;
  satellites: number;
}

const FIRST_NAMES = [
  'علی', 'محمد', 'امیر', 'رضا', 'حسین', 'مهدی', 'علیرضا', 'حمید', 'احمد', 'مصطفی',
  'سعید', 'وحید', 'جواد', 'امین', 'سهراب', 'فرهاد', 'پیمان', 'سامان', 'مهرداد', 'ابوالفضل',
  'کامران', 'کیوان', 'روزبه', 'مسعود', 'نیما', 'ارشیا', 'شایان', 'پویا', 'امید', 'حامد',
  'مجید', 'مرتضی', 'یاسر', 'میثم', 'هادی', 'میلاد', 'سینا', 'عرفان', 'جعفر'
];

const LAST_NAMES = [
  'محمدی', 'رضایی', 'کریمی', 'احمدی', 'حسینی', 'اکبری', 'صادقی', 'کاظمی', 'موسوی', 'نظری',
  'غفاری', 'جمشیدی', 'اسدی', 'طهماسبی', 'ذاکری', 'صالحی', 'بهرامی', 'قاسمی', 'ابراهیمی', 'پوررضا',
  'کشاورز', 'دهقان', 'بیات', 'شاکری', 'خسروی', 'کریمیان', 'شفیعی', 'سجادی', 'پورمند', 'تیموری',
  'جلالی', 'سلیمانی', 'رستمی', 'رحیمی', 'امیری', 'فلاح', 'عسگری', 'یزدانی', 'مقدم', 'زارع'
];

const TRUCKS = [
  'اسکانیا R450', 'ولوو FH500', 'اف‌ام اف‌اچ ۱۲', 'ایویکو استرالیس', 'اکسور بنز ۲۶۳۵',
  'رنو پریمیوم ۴۶۰', 'مان TGX', 'هوو آ۷', 'ماک تراک چرخ‌طلا', 'فوتون اچ۵'
];

const PLATES = [
  '۱۲ ع ۳۴۵ ایران ۵۹', '۴۵ ب ۶۷۸ ایران ۵۹', '۷۸ ج ۹۰۱ ایران ۵۹', '۹۰ د ۲۳۴ ایران ۵۹',
  '۳۴ ق ۵۶۷ ایران ۵۹', '۵۶ ص ۸۹۰ ایران ۵۹', '۱۲ ط ۳۴۵ ایران ۲۲', '۷۸ ن ۹۰۱ ایران ۲۲'
];

const generate50Drivers = (): MockDriver[] => {
  const drivers: MockDriver[] = [];
  for (let i = 0; i < 50; i++) {
    const fIdx = (i * 7) % FIRST_NAMES.length;
    const lIdx = (i * 13) % LAST_NAMES.length;
    const tIdx = (i * 3) % TRUCKS.length;
    const pIdx = i % PLATES.length;
    
    const lat = 36.842 + (Math.sin(i * 0.45) * 0.22);
    const lng = 54.433 + (Math.cos(i * 0.45) * 0.35);
    const speed = 70 + (i % 5) * 8 + (Math.sin(i * 0.3) * 4);
    
    drivers.push({
      id: `mock-drv-${i + 1}`,
      driver: `${FIRST_NAMES[fIdx]} ${LAST_NAMES[lIdx]}`,
      name: `${TRUCKS[tIdx]} - ترانزیت`,
      plate: PLATES[pIdx].replace('۱۲', `${10 + i}`).replace('۳۴۵', `${345 + i}`),
      lat,
      lng,
      speed: Math.round(speed),
      satellites: 10 + (i % 7)
    });
  }
  return drivers;
};

// Convert Decimal Degrees to NMEA Lat/Lng formats (e.g., 36.842 -> 3650.52 N)
const convertToNMEACoords = (lat: number, lng: number) => {
  const latDeg = Math.floor(Math.abs(lat));
  const latMin = ((Math.abs(lat) - latDeg) * 60).toFixed(4);
  const latDir = lat >= 0 ? 'N' : 'S';

  const lngDeg = Math.floor(Math.abs(lng));
  const lngMin = ((Math.abs(lng) - lngDeg) * 60).toFixed(4);
  const lngDir = lng >= 0 ? 'E' : 'W';

  const pad = (num: number, size: number) => {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
  };

  return {
    latStr: `${pad(latDeg, 2)}${latMin}`,
    latDir,
    lngStr: `${pad(lngDeg, 3)}${lngMin}`,
    lngDir
  };
};

export default function SatelliteDeck({ selectedVehicle }: SatelliteDeckProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalFeed, setTerminalFeed] = useState<string[]>([]);
  const [isIntercepting, setIsIntercepting] = useState(true);
  const [laserPingPulse, setLaserPingPulse] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  
  // Real-time HUD telemetry dynamics updated over vehicle visuals
  const [pitch, setPitch] = useState(1.2);
  const [roll, setRoll] = useState(-0.5);
  const [signalLatency, setSignalLatency] = useState(14);

  // Pool of 50 drivers and 2-minute rotation system
  const mockDrivers = useMemo(() => generate50Drivers(), []);
  const [activeDriver, setActiveDriver] = useState<MockDriver | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  // Initialize first driver randomly
  useEffect(() => {
    const initialIdx = Math.floor(Math.random() * 50);
    setActiveDriver(mockDrivers[initialIdx]);
  }, [mockDrivers]);

  // Rotation cycle interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const randomIndex = Math.floor(Math.random() * 50);
          const nextDriver = mockDrivers[randomIndex];
          setActiveDriver(nextDriver);
          
          // Print connection re-route event logs in telemetry stream
          const now = new Date();
          const hhmmss = now.toTimeString().split(' ')[0];
          setTerminalFeed(prevFeed => [
            `$SYS-ROUTE,RANDOM_CYCLE,LOCKED_ON,${nextDriver.driver.toUpperCase()},OK*7F`,
            `*** قفل ارتباط ماهواره‌ای روی راننده جدید: ${nextDriver.driver} ***`,
            ...prevFeed.slice(0, 15)
          ]);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mockDrivers]);

  // SNR Channels state
  const [snrValues, setSnrValues] = useState({
    L1: 44,
    L2: 38,
    L5: 41,
    E1: 39,
    B1: 46
  });

  // Space/Atmospheric factors
  const [solarActivity, setSolarActivity] = useState('معمولی (آرام)');
  const [scintillationIndex, setScintillationIndex] = useState(0.12);
  const [satelliteCount, setSatelliteCount] = useState(14);

  // Real-time dynamic fluctuations for transparent HUD overlay
  useEffect(() => {
    const hudInterval = setInterval(() => {
      const currentTarget = activeDriver || selectedVehicle;
      const isMoving = currentTarget && currentTarget.speed > 0;
      const multiplier = isMoving ? 2.2 : 0.4;
      const time = Date.now() / 900;
      
      setPitch(Number((Math.sin(time) * 1.8 * multiplier + (Math.random() - 0.5) * 0.3).toFixed(1)));
      setRoll(Number((Math.cos(time * 0.7) * 1.4 * multiplier + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setSignalLatency(prev => {
        const drift = Math.round((Math.random() - 0.5) * 2);
        const base = currentTarget ? 11 : 14;
        return Math.max(8, Math.min(25, prev + drift));
      });
    }, 280);

    return () => clearInterval(hudInterval);
  }, [selectedVehicle, activeDriver]);

  // Generate scrolling NMEA log lines based on active driver or selected vehicle
  useEffect(() => {
    if (!isIntercepting) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hhmmss = now.toTimeString().split(' ')[0].replace(/:/g, '');
      const ddmmyy = now.toLocaleDateString('en-GB').replace(/\//g, '').substring(0, 6);

      const currentTarget = activeDriver || selectedVehicle;
      const lat = currentTarget ? currentTarget.lat : 36.842;
      const lng = currentTarget ? currentTarget.lng : 54.433;
      const speedKmH = currentTarget ? (currentTarget.speed || 0) : 0;
      const speedKnots = (speedKmH * 0.539957).toFixed(1);

      const { latStr, latDir, lngStr, lngDir } = convertToNMEACoords(lat, lng);

      // Random sentence patterns
      const sentences = [
        `$GPRMC,${hhmmss}.00,A,${latStr},${latDir},${lngStr},${lngDir},${speedKnots},184.2,${ddmmyy},,,A*5A`,
        `$GPGGA,${hhmmss}.00,${latStr},${latDir},${lngStr},${lngDir},1,12,0.86,183.4,M,-14.2,M,,*6F`,
        `$GPGST,${hhmmss}.00,0.14,0.08,0.12,4.2,4.8,3.9,0.15*4D`,
        `$GPGSV,3,1,11,04,50,111,46,14,35,045,43,21,12,284,39,27,15,310,40*7C`,
        `$BDGSV,2,1,08,19,45,090,44,22,35,180,41,09,24,242,42,30,12,311,38*5B`,
        `$GNZDA,${hhmmss}.00,13,06,2026,00,00*72`
      ];

      const newSentence = sentences[Math.floor(Math.random() * sentences.length)];
      setTerminalFeed(prev => [newSentence, ...prev.slice(0, 16)]);

      // Fluctuate SNR and Space environment
      setSnrValues(prev => ({
        L1: Math.min(50, Math.max(30, prev.L1 + Math.round((Math.random() - 0.5) * 4))),
        L2: Math.min(50, Math.max(25, prev.L2 + Math.round((Math.random() - 0.5) * 3))),
        L5: Math.min(55, Math.max(30, prev.L5 + Math.round((Math.random() - 0.5) * 4))),
        E1: Math.min(50, Math.max(28, prev.E1 + Math.round((Math.random() - 0.5) * 3))),
        B1: Math.min(55, Math.max(35, prev.B1 + Math.round((Math.random() - 0.5) * 2)))
      }));

      // Scintillation drift
      setScintillationIndex(prev => Math.max(0.05, Math.min(0.40, prev + (Math.random() - 0.5) * 0.02)));

      // Sync active satellites with vehicle count if possible
      if (currentTarget && currentTarget.satellites) {
        setSatelliteCount(currentTarget.satellites);
      } else {
        setSatelliteCount(prev => Math.max(8, Math.min(18, prev + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [selectedVehicle, activeDriver, isIntercepting]);

  // Initial terminal entries
  useEffect(() => {
    setTerminalFeed([
      'SYSTEM INITIALIZING ... OK',
      'CONNECT WITH BEIDOU CONTINENTAL ANTENNA ... SUCCESS',
      'ACQUIRING COPERNICUS ATMOSPHERE DISPERSION INDEX ...',
      'CORRECTING IONOSPHERIC DELAY FROM CASPIAN BASE STATION ...',
      'GPS TRACKING PROTOCOL ACTIVATED FOR GOLESTAN TRANSIT FLEETS.'
    ]);
  }, []);

  // Ping Trigger
  const handlePingSatellite = () => {
    setLaserPingPulse(true);
    setPingStatus('در حال ارسال فرکانس بازجویی مکرر به ماهواره...');
    
    // Simulate audio beep visual
    setTimeout(() => {
      setLaserPingPulse(false);
      const targetDriverName = activeDriver ? activeDriver.driver : (selectedVehicle ? selectedVehicle.driver : 'ناوگان عمومی');
      setPingStatus(`سیگنال با موفقیت برگشت! موقعیت راننده ${targetDriverName} تایید شد. تاخیر مسیر: ۱۴ میلی‌ثانیه`);
    }, 1800);

    setTimeout(() => {
      setPingStatus(null);
    }, 6000);
  };

  /**
   * Mocked dynamic satellite polar geometry (coordinates on our custom dynamic dish radar)
   * These points translate directly to their 3D / 2D orbital planes above Gorgan/Golestan
   */
  const orbSatellites = useMemo(() => {
    const seed = selectedVehicle ? selectedVehicle.id : 'default';
    return [
      { id: 'GPS-G24', r: 80, theta: 45, type: 'GPS', db: snrValues.L1, color: '#10b981' },
      { id: 'GPS-G12', r: 140, theta: 110, type: 'GPS', db: snrValues.L2, color: '#10b981' },
      { id: 'GLON-R08', r: 110, theta: 230, type: 'GLO', db: snrValues.L5, color: '#f59e0b' },
      { id: 'GAL-E11', r: 60, theta: 340, type: 'GAL', db: snrValues.E1, color: '#3b82f6' },
      { id: 'GAL-E30', r: 170, theta: 280, type: 'GAL', db: snrValues.E1, color: '#3b82f6' },
      { id: 'BDS-C03', r: 90, theta: 165, type: 'BDS', db: snrValues.B1, color: '#ef4444' },
      { id: 'BDS-C18', r: 130, theta: 15, type: 'BDS', db: snrValues.B1, color: '#ef4444' },
      { id: 'IRAN-O04', r: 40, theta: 195, type: 'IRAN', db: 48, color: '#a855f7' } // Custom Omid satellite
    ];
  }, [selectedVehicle, snrValues]);

  return (
    <div 
      className={`card border border-primary-500/20 bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative transition-all duration-500 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)] shadow-2xl' : 'w-full min-h-[380px] lg:min-h-[420px]'
      }`}
      id="space-satellite-decoding-deck"
    >
      
      {/* Top Deck Banner */}
      <div className="px-5 py-4 bg-[#050b18] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-right" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></span>
            <div className="p-2 bg-gradient-to-tr from-purple-900 to-indigo-950 border border-purple-500/30 rounded-xl text-purple-400">
              <Satellite className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">عرشه مانیتورینگ فضایی سایبرنتیک (سایه امید-۴)</h3>
              <span className="bg-purple-900/40 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-purple-800/50 animate-pulse">
                اتصال ماهواره‌ای آنلاین
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">پایش زنده طیف فرکانس، رله سیگنال و آشکارسازی ترانزیتی استان گلستان</p>
          </div>
        </div>

        {/* Console Action triggers */}
        <div className="flex items-center gap-2 self-center">
          <button
            type="button"
            onClick={() => setIsIntercepting(!isIntercepting)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              isIntercepting 
                ? 'bg-blue-600/15 border-blue-500/30 text-blue-400 hover:bg-blue-600/30' 
                : 'bg-emerald-600/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30'
            }`}
          >
            {isIntercepting ? 'مکث دی‌کودر سیگنال' : 'ادامه دی‌کود فرکانس'}
          </button>

          <button
            type="button"
            onClick={handlePingSatellite}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Radio className={`w-3.5 h-3.5 ${laserPingPulse ? 'animate-spin' : ''}`} />
            تپش فرکانس ماهواره
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
            title="تغییر ابعاد و تمام‌صفحه مانیتورینگ"
          >
            {isFullscreen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Floating status beep confirmation */}
      {pingStatus && (
        <div className="absolute top-20 left-6 right-6 z-10 bg-indigo-950/95 border border-indigo-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-right" dir="rtl">
          <Activity className="w-5 h-5 text-indigo-400 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-white block">پینگ بازتاب همزمان صیانت ماهواره‌ای</span>
            <span className="text-[11px] text-slate-300 block mt-0.5">{pingStatus}</span>
          </div>
        </div>
      )}

      {/* Main Grid contents layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 overflow-auto select-none min-h-0">
        
        {/* PANEL 1 (Left 4 cols): Digital Twin & Smart Telemetry Dashboard (Clean, premium enterprise dashboard, no game HUD) */}
        <div className="lg:col-span-4 bg-[#02050e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between items-stretch relative overflow-hidden h-[340px] shadow-lg shadow-black/40" id="digital-twin-telemetry-panel">
          
          {/* subtle scanning status backdrop */}
          {laserPingPulse && (
            <div className="absolute inset-0 bg-purple-500/5 pointer-events-none animate-pulse z-20"></div>
          )}

          {/* Header */}
          <div className="w-full flex items-center justify-between mb-2.5 border-b border-slate-800/85 pb-2 text-right" dir="rtl">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-white">مدل همزاد مادی (Digital Twin Telemetry)</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono tracking-wider">ENTERPRISE-GRADE CORES</span>
          </div>

          {/* Clean Enterprise Parameters Overview - Replaces sci-fi HUD graphics */}
          <div className="flex-grow flex flex-col justify-between gap-2.5 bg-[#030712] p-3 rounded-xl border border-slate-900 overflow-hidden" dir="rtl">
            
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-900pb-1.5 text-[10.5px]">
              <span className="text-slate-400">وضعیت سامانه سخت‌افزاری:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                پایدار و ایمن (Active)
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
            </div>

            {/* Smart Cargo Parameter 1: Fuel Tank Capacity & Level Indicator */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium">میزان حجم تانکر سوخت:</span>
                <span className="font-mono text-cyan-400 font-semibold">{convertToPersianNumbers('۸۶.۴')}٪</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/30">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  style={{ width: '86.4%' }}
                ></div>
              </div>
            </div>

            {/* Twin Parameters Grid (Temp, pressure, acceleration, safe diagnostics) */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              
              <div className="bg-[#050b18] p-2 rounded-lg border border-slate-900/80">
                <span className="block text-[9.5px] text-slate-500 mb-0.5">دمای تانکر محموله (Safe Temp)</span>
                <span className="font-mono text-xs text-slate-200 font-bold block">{convertToPersianNumbers('۱۹.۵')} °C</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[8px] text-slate-400">در محدوده امن دما</span>
                </div>
              </div>

              <div className="bg-[#050b18] p-2 rounded-lg border border-slate-900/80">
                <span className="block text-[9.5px] text-slate-500 mb-0.5">فشار هیدرولیک لاستیک‌ها</span>
                <span className="font-mono text-xs text-slate-200 font-bold block">PSI {convertToPersianNumbers('۱۰۴')}</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[8px] text-slate-400">فشار تایرها نرمال</span>
                </div>
              </div>

              <div className="bg-[#050b18] p-2 rounded-lg border border-slate-900/80">
                <span className="block text-[9.5px] text-slate-500 mb-0.5">شتاب طولی (Acc/Braking)</span>
                <span className="font-mono text-xs text-slate-200 font-bold block">m/s² {convertToPersianNumbers('۰.۳')}</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[8px] text-slate-400">بدون ترمز ناگهانی</span>
                </div>
              </div>

              <div className="bg-[#050b18] p-2 rounded-lg border border-slate-900/80">
                <span className="block text-[9.5px] text-slate-500 mb-0.5">انحراف زاویه حرکت (Roll)</span>
                <span className="font-mono text-xs text-slate-200 font-bold block">{roll >= 0 ? '+' : ''}{convertToPersianNumbers(roll.toFixed(1))}°</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${Math.abs(roll) > 2 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[8px] text-slate-500">نوسان پیچ جاده‌ای</span>
                </div>
              </div>

            </div>

            {/* Predictive Risk score telemetry index inline */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-l from-purple-950/20 to-transparent border border-purple-500/10 rounded-lg text-right mt-1">
              <div>
                <span className="block text-[8.5px] text-slate-500 leading-none mb-1">ضریب ریسک هوش مصنوعی (Predictive Risk Score)</span>
                <span className="text-[10px] text-purple-300 font-semibold block leading-none">احتمال تصادف یا خستگی راننده کم است</span>
              </div>
              <span className="text-sm font-black text-purple-400 font-mono tracking-tighter bg-purple-950/40 px-2 py-1 rounded border border-purple-800/40">
                {convertToPersianNumbers('۱۲٪')}
              </span>
            </div>

          </div>

          {/* Bottom telemetry widgets bar detailing numeric state */}
          <div className="w-full flex justify-between gap-1 mt-2 text-[10px] text-slate-400 text-right bg-[#050b16] p-2 rounded-xl border border-slate-900" dir="rtl">
            <div className="text-center flex-1">
              <span className="block text-slate-500 text-[8px]">سرعت فعلی (Value)</span>
              <span className="block font-black text-[#10b981] font-mono">
                {activeDriver ? convertToPersianNumbers(activeDriver.speed.toString()) : (selectedVehicle ? convertToPersianNumbers(Math.round(selectedVehicle.speed).toString()) : convertToPersianNumbers('۰'))} km/h
              </span>
            </div>
            <div className="text-center flex-1 border-r border-slate-800">
              <span className="block text-slate-500 text-[8px]">زاویه ناوبری (Heading)</span>
              <span className="block font-black text-blue-400 font-mono">
                {activeDriver ? convertToPersianNumbers((Math.round(activeDriver.speed * 2.1) % 360).toString()) : (selectedVehicle && selectedVehicle.speed ? convertToPersianNumbers((Math.round(selectedVehicle.speed * 2.1) % 360).toString()) : convertToPersianNumbers('۱۸۴'))}°
              </span>
            </div>
            <div className="text-center flex-1 border-r border-slate-800">
              <span className="block text-slate-500 text-[8px]">تاخیر ارتباط سیگنال</span>
              <span className="block font-black text-purple-400 font-mono">{convertToPersianNumbers(signalLatency)}ms</span>
            </div>
          </div>
        </div>

        {/* PANEL 2 (Middle 5 cols): NMEA raw data decoder screen */}
        <div className="lg:col-span-5 bg-[#02050e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="w-full flex items-center justify-between mb-3 border-b border-gray-900 pb-2 text-right" dir="rtl">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">تله‌متری زنده ماهواره‌ای (NMEA Stream)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[10px] text-slate-400/80 font-mono">Baud Rate: 115200</span>
            </div>
          </div>

          {/* Scrolling terminal window */}
          <div className="flex-grow font-mono text-[9.5px] leading-relaxed text-emerald-300 bg-slate-950/60 p-3 rounded-xl border border-slate-900/60 overflow-y-auto max-h-[220px] custom-scrollbar text-left flex flex-col-reverse justify-end shadow-inner gap-1 min-h-[140px]">
            {terminalFeed.length === 0 ? (
              <span className="text-slate-600 block animate-pulse">در حال اتصال اولیه به گیرنده و شنود شبکه‌های فضایی...</span>
            ) : (
              terminalFeed.map((line, index) => (
                <div key={index} className={`truncate py-0.5 border-b border-slate-900/20 ${index === 0 ? 'text-white border-l-2 border-l-emerald-400 pl-1.5 bg-emerald-950/25' : 'text-emerald-400/80'}`}>
                  {line}
                </div>
              ))
            )}
          </div>

          {/* Selected user driver telemetry highlight card */}
          <div className="mt-4 p-3 bg-[#050b18] rounded-xl border border-purple-500/20 flex flex-col gap-2.5 text-right animate-pulse-subtle" dir="rtl" style={{ animationDuration: '3s' }}>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-300">کشف فعال ۵۰ راننده ترانزیت (سیگنال تصادفی ۲ دقیقه‌ای)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-800/30" dir="ltr">
                Next: {timeLeft}s
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <span className="block text-[8.5px] text-slate-500">خودرو ترانزیتی فعال</span>
                  <span className="block text-xs font-bold text-slate-200">
                    {activeDriver ? activeDriver.name : (selectedVehicle ? selectedVehicle.name : 'انتخاب نشده')}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <div>
                  <span className="text-slate-500">راننده زنده:</span>{' '}
                  <strong className="text-slate-100">{activeDriver ? activeDriver.driver : (selectedVehicle ? selectedVehicle.driver : 'سیستم دیسپچ')}</strong>
                </div>
                <div>
                  <span className="text-slate-500">پلاک:</span>{' '}
                  <span className="text-slate-300 font-semibold">{activeDriver ? activeDriver.plate : '---'}</span>
                </div>
                <div className="font-mono text-[9.5px] text-slate-400 text-left">
                  مختصات:{' '}
                  {activeDriver 
                    ? `${activeDriver.lat.toFixed(4)} / ${activeDriver.lng.toFixed(4)}` 
                    : (selectedVehicle ? `${selectedVehicle.lat.toFixed(4)} / ${selectedVehicle.lng.toFixed(4)}` : 'N/A')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3 (Right 3 cols): Signal strength SNR spectrum analyzer */}
        <div className="lg:col-span-3 bg-[#030611] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-start overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4 border-b border-gray-900 pb-2 text-right" dir="rtl">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">قدرت فرکانس سیگنال (SNR Spectrum)</span>
            </div>
            <span className="text-[10px] text-blue-400 font-mono">dB-Hz</span>
          </div>

          {/* Channels strength bars */}
          <div className="space-y-3.5 my-auto">
            {/* GPS L1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]" dir="rtl">
                <span className="text-emerald-400 font-bold">GPS L1 (فرکانس صوتی)</span>
                <span className="font-mono text-slate-400">{convertToPersianNumbers(snrValues.L1)} dB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(snrValues.L1 / 55) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* GPS L2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]" dir="rtl">
                <span className="text-amber-400 font-bold">GPS L2 (رله سیگنال فرعی)</span>
                <span className="font-mono text-slate-400">{convertToPersianNumbers(snrValues.L2)} dB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${(snrValues.L2 / 55) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Galileo E1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]" dir="rtl">
                <span className="text-blue-400 font-bold">Galileo E1 (آرواره مرکزی)</span>
                <span className="font-mono text-slate-400">{convertToPersianNumbers(snrValues.E1)} dB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(snrValues.E1 / 55) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* BeiDou B1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]" dir="rtl">
                <span className="text-red-400 font-bold">BeiDou B1 (چینی قطب شمالی)</span>
                <span className="font-mono text-slate-400">{convertToPersianNumbers(snrValues.B1)} dB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${(snrValues.B1 / 55) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 mt-4 pt-3.5 space-y-2 text-[10.5px] text-slate-400 text-right" dir="rtl">
            <div className="flex justify-between">
              <span className="text-slate-500">طوفان خورشیدی (Geomagnetic):</span>
              <span className="text-emerald-400 font-semibold">{solarActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">اعوجاج یونوسفر (Scint):</span>
              <span className="text-amber-400 font-mono">S4: {scintillationIndex.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative cyber line border */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"></div>
    </div>
  );
}
