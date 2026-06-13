/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ActiveTab, Vehicle, Company } from './types';
import { mockCompanies, allVehicles } from './data/mockData';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import VehiclesPanel from './components/VehiclesPanel';
import ReportsPanel from './components/ReportsPanel';
import UsersPanel from './components/UsersPanel';
import SatelliteDeck from './components/SatelliteDeck';
import { Radio, AlertCircle, Compass, ShieldCheck } from 'lucide-react';
import { convertToPersianNumbers } from './utils/jalali';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live-tracking');
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('avl-theme');
      if (stored) {
        return stored === 'dark';
      }
      return true; // default to dark theme as modeled
    } catch {
      return true;
    }
  });

  // State of all vehicles to enable real-time tracking simulation
  const [vehicles, setVehicles] = useState<Vehicle[]>(allVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('3'); // Default to Azadshahr25 (moving)

  // Sync theme class with document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkTheme) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      try {
        localStorage.setItem('avl-theme', 'dark');
      } catch (e) {}
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      try {
        localStorage.setItem('avl-theme', 'light');
      } catch (e) {}
    }
  }, [darkTheme]);

  // Find active selected vehicle instance from state list
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
  };

  // Group vehicles by company ID to update their nesting structure for Sidebar
  const groupedCompanies = mockCompanies.map(company => {
    const companyVehicles = vehicles.filter(v => v.companyId === company.id);
    return {
      ...company,
      vehicles: companyVehicles
    };
  });

  // Real-time fleet simulator loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(v => {
          if (v.status !== 'moving') return v;

          // Minor coordinate alterations along highways
          const latShift = (Math.random() - 0.5) * 0.0006;
          const lngShift = (Math.random() - 0.4) * 0.0008; // slight eastward tendency

          // Minor variance in speed metric
          const currentSpeed = v.speed || 50;
          const speedShift = Math.round((Math.random() - 0.5) * 6);
          const nextSpeed = Math.max(20, Math.min(110, currentSpeed + speedShift));

          // Satellite variations
          const satVariance = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const nextSats = Math.max(6, Math.min(22, (v.satellites || 12) + satVariance));

          // Battery decrease or simulation values
          const batteryLeak = Math.random() > 0.95 ? -1 : 0;
          const nextBat = Math.max(5, Math.min(100, (v.battery || 95) + batteryLeak));

          return {
            ...v,
            lat: v.lat + latShift,
            lng: v.lng + lngShift,
            speed: nextSpeed,
            satellites: nextSats,
            battery: nextBat,
            lastUpdate: 'هم‌اکنون'
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('آیا مایل به خروج از سامانه دیسپچ ناوگان هستید؟');
    if (confirmLogout) {
      alert('شما با موفقیت خارج شدید. جهت دسترسی مجدد، لطفا مجددا وارد حساب کاربری خود شوید.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans flex flex-col antialiased">
      
      {/* Dynamic Header navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkTheme={darkTheme} 
        setDarkTheme={setDarkTheme} 
        logout={handleLogout}
      />

      {/* Main Panel Content Container */}
      <main className="flex-1 pt-20 pb-12 px-6 flex flex-col justify-start">
        
        {activeTab === 'live-tracking' && (
          <div className="flex flex-col min-h-[calc(100vh-160px)] gap-5 pb-12">
            
            {/* Title bar */}
            <div className="flex items-center justify-between flex-shrink-0 text-right">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200/50">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                  بروزرسانی زنده فعال
                </span>
                <span className="hidden sm:inline-block bg-primary-100/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-200/50 dark:border-primary-900/50">
                  مرکز فرماندهی پیشرفته
                </span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                مرکز دیسپچ و ردیابی لحظه‌ای ماهواره‌ای ناوگان
                <Compass className="w-5 h-5 text-primary-500" />
              </h1>
            </div>

            {/* Split layout: Selector list & interactive map */}
            <div className="flex flex-col-reverse lg:flex-row gap-4 h-[580px] lg:h-[640px] flex-shrink-0">
              {/* Map rendering Panel */}
              <MapArea 
                vehicles={vehicles} 
                selectedVehicle={selectedVehicle} 
                onSelectVehicle={handleSelectVehicle}
                darkTheme={darkTheme}
              />
              
              {/* Filter list Sidebar panel */}
              <Sidebar 
                companies={groupedCompanies} 
                selectedVehicle={selectedVehicle}
                onSelectVehicle={handleSelectVehicle}
              />
            </div>

            {/* Satellite Signal intercept and telemetry deck */}
            <SatelliteDeck selectedVehicle={selectedVehicle} />
          </div>
        )}

        {/* Database List view */}
        {activeTab === 'vehicles' && (
          <div className="flex-1">
            <VehiclesPanel vehicles={vehicles} />
          </div>
        )}

        {/* Analytics Reports view */}
        {activeTab === 'reports' && (
          <div className="flex-1">
            <ReportsPanel vehicles={vehicles} />
          </div>
        )}

        {/* Dispatch team Users view */}
        {activeTab === 'users' && (
          <div className="flex-1">
            <UsersPanel />
          </div>
        )}

      </main>

      {/* Footer system status bar */}
      <footer className="fixed bottom-0 inset-x-0 h-9 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-200/70 dark:border-gray-800/70 flex items-center justify-between px-6 z-30 select-none text-[10px] text-gray-400 dark:text-gray-500">
        <span className="tracking-wide">سامانه پایش هوشمند ناوگان ترانزیتی · jupintrace.ir</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            ارتباط ماهواره‌ای امن برقرار است
          </span>
          <span className="font-mono">نسخه ۱.۱.۰</span>
        </div>
      </footer>
    </div>
  );
}
