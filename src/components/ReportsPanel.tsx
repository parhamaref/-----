/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { convertToPersianNumbers } from '../utils/jalali';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Map, 
  CheckCircle, 
  Clock, 
  Download,
  Calendar,
  Layers,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ReportsPanelProps {
  vehicles: Vehicle[];
}

export default function ReportsPanel({ vehicles }: ReportsPanelProps) {
  const [reportRange, setReportRange] = useState<'today' | 'week' | 'month'>('week');
  const [downloading, setDownloading] = useState(false);

  // Daily mileage mockup data (in km)
  const dailyMileage = [
    { day: 'شنبه', distance: 320 },
    { day: 'یکشنبه', distance: 410 },
    { day: 'دوشنبه', distance: 380 },
    { day: 'سه‌شنبه', distance: 512 },
    { day: 'چهارشنبه', distance: 460 },
    { day: 'پنج‌شنبه', distance: 290 },
    { day: 'جمعه', distance: 150 },
  ];

  // System warnings stream
  const systemAlerts = [
    { id: 1, text: 'سرعت غیرمجاز ردیاب آزادشهر25: ۸۵ کیلومتر بر ساعت در بزرگراه کمربندی', time: '۱۰ دقیقه پیش', level: 'high' },
    { id: 2, type: 'info', text: 'مجوز صنفی راننده سعید یازرلو با موفقیت تایید و تمدید شد', time: '۲ ساعت پیش', level: 'low' },
    { id: 3, text: 'قطع فرکانس باتری در ماهواره ردیاب گرگان02', time: '۵ ساعت پیش', level: 'high' },
    { id: 4, text: 'ورود غیرمجاز خودرو صنعت معدن علی‌آباد01 به محدوده حصار جغرافیایی ۱', time: '۱ روز پیش', level: 'medium' },
    { id: 5, text: 'توقف بیش از حد مجاز (۴ ساعت) خودرو بندرگز 1 در پارکینگ بندرگز', time: '۲ روز پیش', level: 'low' }
  ];

  const totalKmRun = useMemo(() => {
    return dailyMileage.reduce((acc, curr) => acc + curr.distance, 0);
  }, []);

  const averageDailyKm = useMemo(() => {
    return Math.round(totalKmRun / dailyMileage.length);
  }, [totalKmRun]);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('گزارش جامع اکسل با موفقیت بارگذاری و ذخیره شد.');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full gap-4 text-right animate-fade-in">
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <button 
          type="button" 
          onClick={handleExport}
          disabled={downloading}
          className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 dark:bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'در حال صدور اکسل...' : 'خروجی اکسل گزارش'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200/40 dark:border-gray-700 flex items-center select-none">
            <button
              onClick={() => setReportRange('month')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'month' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              ماه گذشته
            </button>
            <button
              onClick={() => setReportRange('week')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'week' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              هفته گذشته
            </button>
            <button
              onClick={() => setReportRange('today')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${reportRange === 'today' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              امروز
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">گزارشات آماری ناوگان</h2>
        </div>
      </div>

      {/* KPI Stats widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full">۱۲٪+ بهبود کارکرد</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">کُل مسافت طیشده ناوگان</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(totalKmRun)} <span className="text-xs text-gray-400">کیلومتر</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/20 px-2.5 py-0.5 rounded-full">سیستم منطبق</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">میانگین روزانه هر خودرو</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(averageDailyKm)} <span className="text-xs text-gray-400">کیلومتر در روز</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full">۴ هشدار حل نشده</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold mb-1">ضریب عدم انطباق سرعت</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none font-mono">
            {convertToPersianNumbers(3.2)} <span className="text-xs text-gray-400">درصد لغزش</span>
          </p>
        </div>
      </div>

      {/* Main Charts & Alert panels split row */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* Alerts terminal history stream */}
        <div className="flex-[40] card overflow-hidden flex flex-col p-4 min-h-0">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-3 flex-shrink-0">
            <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">لایو مانیتور</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">ردیف رخدادها و هشدارهای امنیتی</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 custom-scrollbar pr-1">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="py-3 last:pb-0 flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">{alert.text}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block font-mono flex items-center gap-1 justify-end">
                    <span>{alert.time}</span>
                    <Clock className="w-3 h-3" />
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                  alert.level === 'high' ? 'bg-red-50 dark:bg-red-950/20 text-red-500' :
                  alert.level === 'medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic bar charts distance */}
        <div className="flex-[60] card flex flex-col p-5 min-h-0">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-5 flex-shrink-0">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">۷ روز گذشته</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">نمودار مقایسه‌ای مسافت طی‌شده کل ناوگان</h3>
          </div>

          {/* Core CSS Responsive Chart builder */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex justify-between items-end h-48 sm:h-56 gap-3 sm:gap-6 border-b border-gray-200 dark:border-gray-800 pb-1 flex-shrink-0 px-2">
              {dailyMileage.map((val, idx) => {
                const heightPercent = Math.round((val.distance / 600) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                    {/* Tooltip on bar hover */}
                    <div className="opacity-0 group-hover/bar:opacity-100 bg-gray-900 text-white font-mono text-[9px] px-2 py-1 rounded shadow-lg absolute -translate-y-12 transition-all transition-opacity z-10 whitespace-nowrap">
                      {convertToPersianNumbers(val.distance)} km
                    </div>
                    {/* Active Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg group-hover/bar:from-primary-500 group-hover/bar:to-primary-300 transition-all shadow-md shadow-primary-500/10 cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    {/* Day name label */}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1 whitespace-nowrap">{val.day}</span>
                  </div>
                );
              })}
            </div>
            {/* Axis marks under chart */}
            <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-600 font-mono pt-1 pb-3">
              <span>(کمینه کارکرد جمعه)</span>
              <span>(اوج ترانزیت سه‌شنبه)</span>
            </div>

            {/* AI Advisor recommendations */}
            <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100/50 dark:border-primary-900/40 rounded-xl p-3.5 flex items-start gap-3 mt-auto">
              <div className="flex-1 text-xs">
                <span className="font-bold text-primary-700 dark:text-primary-300 flex items-center gap-1.5 justify-end">
                  توصیه هوشمند پایش سوخت و ترانزیت
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                </span>
                <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  بر اساس نمودار ترافیک هفته جاری، با انتقال بیش از ۱۲٪ ترانزیت روز سه‌شنبه به پنج‌شنبه، میزان اتلاف سوخت کل ناوگان در ترافیک‌های کمربندی آزادشهر تا گنبد تا **۷.۴ درصد** کاهش می‌یابد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
