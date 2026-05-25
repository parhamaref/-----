/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { convertToPersianNumbers } from '../utils/jalali';
import { 
  Plus, 
  Search, 
  MapPin, 
  ShieldAlert, 
  Wrench, 
  Trash2, 
  CheckCircle,
  Clock,
  BatteryCharging
} from 'lucide-react';

interface VehiclesPanelProps {
  vehicles: Vehicle[];
}

export default function VehiclesPanel({ vehicles }: VehiclesPanelProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.driver.includes(search);
      const matchStatus = filterStatus === 'all' || v.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [vehicles, search, filterStatus]);

  return (
    <div className="flex flex-col h-full gap-4 text-right animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <button 
          type="button" 
          className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن ردیاب جدید</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">مدیریت فیزیکی خودروها و ردیاب‌ها</h2>
      </div>

      <div className="card flex-1 min-h-0 flex flex-col p-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4 flex-shrink-0 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto select-none">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              همه ({convertToPersianNumbers(vehicles.length)})
            </button>
            <button
              onClick={() => setFilterStatus('moving')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === 'moving' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              فعال ({convertToPersianNumbers(vehicles.filter(v => v.status === 'moving').length)})
            </button>
            <button
              onClick={() => setFilterStatus('stopped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === 'stopped' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              متوقف ({convertToPersianNumbers(vehicles.filter(v => v.status === 'stopped').length)})
            </button>
            <button
              onClick={() => setFilterStatus('offline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === 'offline' ? 'bg-gray-50 dark:bg-gray-800 text-gray-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              بدون سیگنال ({convertToPersianNumbers(vehicles.filter(v => v.status === 'offline').length)})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس خودرو، راننده..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-900 dark:text-white text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Database Grid */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 select-none">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">وضعیت ردیاب</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">نام دستگاه</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">راننده فعال</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">کُد جواز صنف</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">آخرین فرکانس مکان</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">سلامت باطری</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">به‌روزرسانی</th>
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-24">عملیات فنی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      v.status === 'moving' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' :
                      v.status === 'stopped' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        v.status === 'moving' ? 'bg-emerald-500' :
                        v.status === 'stopped' ? 'bg-amber-400' : 'bg-gray-400'
                      }`}></span>
                      {v.status === 'moving' ? 'در حرکت' : v.status === 'stopped' ? 'مکث سوئیچ' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">{v.name}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-700 dark:text-gray-300">{v.driver}</td>
                  <td className="px-4 py-3.5 font-mono text-gray-500 dark:text-gray-400">{convertToPersianNumbers(v.license)}</td>
                  <td className="px-4 py-3.5 font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 justify-end">
                    <span>{convertToPersianNumbers(v.lat.toFixed(3))} , {convertToPersianNumbers(v.lng.toFixed(3))}</span>
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  </td>
                  <td className="px-4 py-3.5">
                    {v.battery ? (
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-gray-700 dark:text-gray-300">{convertToPersianNumbers(v.battery)}%</span>
                        <BatteryCharging className="w-4 h-4 text-emerald-500" />
                      </div>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                    <span>{v.lastUpdate}</span>
                    <Clock className="w-3.5 h-3.5 text-gray-300" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button type="button" className="p-1 text-gray-400 hover:text-primary-500 transition-colors" title="عیب‌یابی سیگنال">
                        <Wrench className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="حذف دستگاه">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
