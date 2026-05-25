/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ActiveTab } from '../types';
import { getFormattedJalali, convertToPersianNumbers } from '../utils/jalali';
import { 
  Truck, 
  Map, 
  Car, 
  BarChart3, 
  Users2, 
  Calendar, 
  Sun, 
  Moon, 
  Bell, 
  LogOut, 
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkTheme: boolean;
  setDarkTheme: (dark: boolean) => void;
  logout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, darkTheme, setDarkTheme, logout }: NavbarProps) {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const persianDate = getFormattedJalali();

  const notifications = [
    { id: 1, type: 'alert', text: 'سرعت غیرمجاز ردیاب آزادشهر25: ۸۵ کیلومتر بر ساعت', time: '۱۰ دقیقه پیش' },
    { id: 2, type: 'info', text: 'مجوز صنفی راننده سعید یازرلو تایید شد', time: '۲ ساعت پیش' },
    { id: 3, type: 'alert', text: 'قطع سیگنال باتری برای ردیاب گرگان02', time: '۵ ساعت پیش' }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm flex items-center justify-between px-6">
      
      {/* Right Section: Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
          <Truck className="w-5 h-5 text-primary-500" />
        </div>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('live-tracking')}>
          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/10">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">سامانه مدیریت ناوگان</span>
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">پایش هوشمند لایو ردیاب‌ها</span>
          </div>
        </div>
      </div>

      {/* Center Section: Tab menu options */}
      <nav className="hidden md:flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('live-tracking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'live-tracking'
              ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/50'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>مرکز کنترل</span>
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vehicles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vehicles'
              ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/50'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>ناوگان من</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/50'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>گزارشات و آنالیز</span>
        </button>

        <span className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2"></span>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/50'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>کاربران</span>
        </button>
      </nav>

      {/* Left Section: Date, Theme toggle, alert notifications & profile dropdown */}
      <div className="flex items-center gap-3">
        {/* Persian Shamsi date tag */}
        <div className="hidden lg:flex items-center gap-2 text-[10.5px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-950 rounded-xl px-4 py-2 border border-gray-200/50 dark:border-gray-800/80 shadow-inner">
          <Calendar className="h-3.5 w-3.5 text-primary-500" />
          <span>{persianDate}</span>
        </div>

        {/* Theme mode trigger */}
        <button
          type="button"
          onClick={() => setDarkTheme(!darkTheme)}
          className="p-2.5 rounded-xl bg-gray-100/60 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300 transition-all border border-gray-200/40 dark:border-gray-800/80 shadow-sm"
          title={darkTheme ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک"}
        >
          {darkTheme ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </button>

        {/* Notifications Alert Center */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="p-2.5 rounded-xl bg-gray-100/60 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300 transition-all border border-gray-200/40 dark:border-gray-800/80 shadow-sm relative focus:outline-none"
            title="اطلاعیه‌ها"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-gray-950"></span>
          </button>

          {showBellDropdown && (
            <div className="absolute left-0 mt-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-80 py-2.5 z-50 text-right animate-fade-in">
              <div className="px-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] text-primary-500 hover:underline cursor-pointer font-bold">خوانده شده کُل</span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">نمایش فعالیت‌های زنده</h4>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800/60 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 flex items-start gap-2 text-right">
                    <div className="flex-1">
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 font-semibold">{item.text}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">{item.time}</span>
                    </div>
                    {item.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile initial */}
        <div className="h-9 w-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white font-bold text-xs select-none">
          ک
        </div>

        {/* Sign out button */}
        <button
          type="button"
          onClick={logout}
          className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-950/40"
          title="خروج از سامانه"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
