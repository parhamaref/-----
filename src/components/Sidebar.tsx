/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Company, Vehicle, VehicleStatus } from '../types';
import { convertToPersianNumbers, formatPersianSpeed } from '../utils/jalali';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Award, 
  Battery, 
  Wifi, 
  Compass, 
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  companies: Company[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function Sidebar({ companies, selectedVehicle, onSelectVehicle }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'moving' | 'stopped' | 'offline'>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Toggle group collapse status
  const toggleGroup = (companyId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  // Filter companies and vehicles based on search and status tabs
  const filteredCompanies = useMemo(() => {
    return companies.map(company => {
      const filteredVehicles = company.vehicles.filter(v => {
        // Search matches vehicle name or driver name
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              v.driver.includes(searchTerm);
        
        // Status filter matching
        const matchesStatus = activeFilter === 'all' || v.status === activeFilter;
        
        return matchesSearch && matchesStatus;
      });

      return {
        ...company,
        vehicles: filteredVehicles
      };
    }).filter(company => company.vehicles.length > 0); // Hide empty organizations
  }, [companies, searchTerm, activeFilter]);

  // Statistics summaries
  const totalVehiclesCount = useMemo(() => {
    return companies.reduce((acc, c) => acc + c.vehicles.length, 0);
  }, [companies]);

  const movingCount = useMemo(() => {
    return companies.reduce((acc, c) => acc + c.vehicles.filter(v => v.status === 'moving').length, 0);
  }, [companies]);

  const stoppedCount = useMemo(() => {
    return companies.reduce((acc, c) => acc + c.vehicles.filter(v => v.status === 'stopped').length, 0);
  }, [companies]);

  const offlineCount = useMemo(() => {
    return companies.reduce((acc, c) => acc + c.vehicles.filter(v => v.status === 'offline').length, 0);
  }, [companies]);

  return (
    <div className="w-full lg:w-[480px] xl:w-[560px] flex-shrink-0 flex flex-col h-full gap-4 text-right">
      <div className="card flex flex-col overflow-hidden h-full">
        {/* Title and stats bar */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs px-2.5 py-1 rounded-full font-bold">
            {convertToPersianNumbers(totalVehiclesCount)} دستگاه ناوگان
          </span>
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">لیست رادار خودروها</h3>
          </div>
        </div>

        {/* Live Filter Tags */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex gap-2 flex-shrink-0 bg-gray-50/60 dark:bg-gray-800/20 overflow-x-auto select-none">
          <button 
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all' 
                ? 'bg-primary-600 text-white shadow shadow-primary-500/20' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            همه ({convertToPersianNumbers(totalVehiclesCount)})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('moving')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeFilter === 'moving' 
                ? 'bg-emerald-600 text-white shadow shadow-emerald-500/20' 
                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
            }`}
          >
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block"></span>
            در حرکت ({convertToPersianNumbers(movingCount)})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('stopped')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeFilter === 'stopped' 
                ? 'bg-amber-600 text-white shadow shadow-amber-500/20' 
                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
            }`}
          >
            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full inline-block"></span>
            متوقف ({convertToPersianNumbers(stoppedCount)})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('offline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeFilter === 'offline' 
                ? 'bg-gray-600 text-white shadow' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full inline-block"></span>
            غیرفعال ({convertToPersianNumbers(offlineCount)})
          </button>
        </div>

        {/* Live Search Inputs */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex items-center gap-2 py-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="جستجوی خودرو یا راننده..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:bg-gray-900 text-gray-900 dark:text-white transition-all text-right"
              dir="rtl"
            />
          </div>
          <button 
            type="button"
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
            title="فیلتر پیشرفته"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Accordion List Content */}
        <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-gray-400">هیچ خودرویی با فیلتر کنونی یافت نشد.</p>
              <button 
                type="button" 
                onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                className="mt-3 text-xs text-primary-500 font-bold hover:underline"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCompanies.map((company) => {
                const isCollapsed = collapsedGroups[company.id];
                const activeInMoving = company.vehicles.filter(v => v.status === 'moving').length;
                
                return (
                  <div key={company.id} className="flex flex-col">
                    {/* Organization Group Header */}
                    <div 
                      onClick={() => toggleGroup(company.id)}
                      className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        {activeInMoving > 0 && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[9px] animate-pulse">
                            {convertToPersianNumbers(activeInMoving)} در حرکت
                          </span>
                        )}
                        <span className="bg-gray-200 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 font-bold px-2 py-0.5 rounded-full text-[9.5px]">
                          {convertToPersianNumbers(company.vehicles.length)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        )}
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-xs">
                          {company.name}
                        </span>
                      </div>
                    </div>

                    {/* Vehicles checklist items within company */}
                    {!isCollapsed && (
                      <div className="bg-white dark:bg-transparent transition-all">
                        {company.vehicles.map((v) => {
                          const isSelected = selectedVehicle && selectedVehicle.id === v.id;
                          
                          return (
                            <div 
                              key={v.id}
                              onClick={() => onSelectVehicle(v)}
                              className={`group/item px-4 py-3 border-b border-gray-100/60 dark:border-gray-800/60 cursor-pointer transition-all flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-primary-50/50 dark:bg-primary-950/20 border-r-4 border-r-primary-500' 
                                  : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                              } ${
                                v.status === 'offline' ? 'opacity-60' : 'opacity-100'
                              }`}
                            >
                              {/* Left telemetry sensors context */}
                              <div className="flex items-center gap-3">
                                {v.status !== 'offline' ? (
                                  <div className="flex items-center gap-2 font-mono text-[10.5px]">
                                    {/* GSM Signal */}
                                    <div className="relative group/gsm" title={`سیگنال مودم: ${v.gsm}/31`}>
                                      <Wifi className={`w-3.5 h-3.5 ${
                                        (v.gsm || 0) > 20 ? 'text-emerald-500' : (v.gsm || 0) > 10 ? 'text-amber-500' : 'text-red-500'
                                      }`} />
                                    </div>

                                    {/* GPS Satellites */}
                                    <div className="relative group/gps" title={`${v.satellites} ماهواره فعال`}>
                                      <Compass className={`w-3.5 h-3.5 ${
                                        (v.satellites || 0) > 10 ? 'text-emerald-500' : 'text-amber-500'
                                      }`} />
                                    </div>

                                    {/* Battery */}
                                    <div className="relative group/bat flex items-center gap-0.5" title={`شارژ باتری: ${v.battery}%`}>
                                      <Battery className={`w-3.5 h-3.5 ${
                                        (v.battery || 0) > 75 ? 'text-emerald-500' : (v.battery || 0) > 25 ? 'text-amber-500' : 'text-red-500'
                                      }`} />
                                    </div>

                                    {/* Real-time calculated speed */}
                                    <div className="mr-1.5 flex items-center bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-[9.5px]">
                                      <span className={`${v.status === 'moving' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {convertToPersianNumbers(v.speed || 0)}
                                      </span>
                                      <span className="text-[8px] text-gray-400 mr-0.5">km/h</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold italic">آفلاین</span>
                                )}

                                {/* Hover action launch detail details */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectVehicle(v);
                                  }}
                                  className="text-primary-500 dark:text-primary-400 hover:text-primary-700 p-1 rounded hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 opacity-0 group-hover/item:opacity-100 transition-all"
                                  title="جزئیات تله‌متری"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Right main identifiers (Vehicle / Driver name) */}
                              <div className="flex items-center gap-3 max-w-[50%]">
                                <div className="text-right min-w-0">
                                  <div className="font-bold text-xs truncate text-gray-800 dark:text-gray-100">
                                    {v.name}
                                  </div>
                                  <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5 mt-0.5 justify-end flex-wrap">
                                    {v.fuelIntegrity && v.fuelIntegrity.status !== 'safe' && (
                                      <span className={`px-1 py-0.5 rounded text-[8.5px] font-bold inline-flex items-center gap-0.5 ${
                                        v.fuelIntegrity.status === 'warning' 
                                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450 border border-amber-500/20 animate-pulse'
                                          : 'bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-500/20 animate-pulse'
                                      }`} title={v.fuelIntegrity.logMessage}>
                                        هشدار سوخت ⚠️
                                      </span>
                                    )}
                                    {v.driverScore && (
                                      <span className={`px-1 py-0.5 rounded text-[8.5px] font-bold inline-flex items-center gap-0.5 ${
                                        v.driverScore.score >= 90 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                        v.driverScore.score >= 80 ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-500/20' :
                                        v.driverScore.score >= 65 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/10' :
                                        'bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-500/10'
                                      }`} title={`ترمز شدید: ${convertToPersianNumbers(v.driverScore.harshBrakesCount.toString())} | شتاب ناگهانی: ${convertToPersianNumbers(v.driverScore.rapidAccelerationCount.toString())} | سرعت غیرمجاز: ${convertToPersianNumbers(v.driverScore.speedingEventsCount.toString())} | مصرف سوخت: ${convertToPersianNumbers(v.driverScore.fuelConsumptionRate.toString())}L | رفتار رانندگی: ${v.driverScore.behaviorGrade}`}>
                                        امتیاز: {convertToPersianNumbers(v.driverScore.score.toString())}
                                      </span>
                                    )}
                                    <span>{v.driver}</span>
                                    {v.license && (
                                      <div className="relative inline-flex group/cert ml-0.5">
                                        <Award className="w-3 h-3 text-emerald-500 hover:text-emerald-600 cursor-pointer" />
                                        {/* Hover Permit code */}
                                        <div className="absolute right-full bottom-0 mr-1.5 bg-gray-950 text-white rounded-lg shadow-xl px-2 py-1 text-[9px] opacity-0 group-hover/cert:opacity-100 transition-opacity z-20 pointer-events-none line-clamp-1 leading-none font-mono">
                                          جواز صنف: {convertToPersianNumbers(v.license)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Pulse active indicator */}
                                <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${
                                  v.status === 'moving' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                  v.status === 'stopped' ? 'bg-amber-400 shadow-amber-400/20' : 
                                  'bg-gray-300 dark:bg-gray-700'
                                }`}></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
