/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { convertToPersianNumbers } from '../utils/jalali';
import { 
  Users2, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Settings, 
  Key, 
  Lock,
  Clock,
  UserPlus
} from 'lucide-react';

export default function UsersPanel() {
  const [users, setUsers] = useState([
    { id: 1, name: 'وحید خوری', email: 'vahid.khori@gmail.com', role: 'مدیر کل سیستم (Super Admin)', status: 'active', lastLogin: 'هم‌اکنون', avatar: 'و' },
    { id: 2, name: 'مهسا میرزایی', email: 'm.mirzayi@fleet.ir', role: 'ناظر ترانزیت آزادشهر', status: 'active', lastLogin: '۱۰ دقیقه پیش', avatar: 'م' },
    { id: 3, name: 'سعید یازرلو', email: 's.yazarloo@fleet.ir', role: 'اپراتور مرکز کنترل گنبد', status: 'active', lastLogin: '۲ ساعت پیش', avatar: 'س' },
    { id: 4, name: 'رقیه سعیدی', email: 'r.saeedi@fleet.ir', role: 'دیسپچر ناوگان گرگان', status: 'away', lastLogin: '۱ روز پیش', avatar: 'ر' },
    { id: 5, name: 'جواد شیرازی', email: 'j.shirazi@fleet.ir', role: 'مدیر فنی ردیاب‌ها', status: 'offline', lastLogin: '۳ روز پیش', avatar: 'ج' },
  ]);

  return (
    <div className="flex flex-col h-full gap-4 text-right countries-fade-in animate-fade-in">
      {/* Header control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <button 
          type="button" 
          className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>ثبت کاربر یا اپراتور جدید</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">حساب‌های کاربری و سطوح دسترسی مرکز دیسپچ</h2>
      </div>

      <div className="card flex-1 min-h-0 flex flex-col p-5 overflow-y-auto">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-5 flex-shrink-0 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-450 text-gray-400">سطوح مجوز امنیتی کُد رمزگذاری‌شده</span>
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            اپراتورهای فعال سامانه مدیریت
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </h3>
        </div>

        {/* Dispatcher users grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="border border-gray-150 dark:border-gray-800 rounded-2xl p-4 hover:shadow-lg transition-all hover:border-primary-100 dark:hover:border-primary-900 bg-gray-50/20 dark:bg-gray-900/10 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center shadow font-bold text-lg">
                  {user.avatar}
                </div>
                
                <div className="flex-1 min-w-0 text-right">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1 border ${
                    user.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100/50 dark:border-emerald-900/30' :
                    user.status === 'away' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100/50 dark:border-amber-900/30' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200/50 dark:border-gray-700/30'
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${
                      user.status === 'active' ? 'bg-emerald-500' :
                      user.status === 'away' ? 'bg-amber-400' : 'bg-gray-400'
                    }`}></span>
                    {user.status === 'active' ? 'آنلاین' : user.status === 'away' ? 'برون سیستم' : 'آفلاین'}
                  </span>
                  
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5 truncate">{user.role}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800/80 pt-3 mt-4 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-mono flex items-center gap-1">
                  <span>{user.lastLogin}</span>
                  <Clock className="w-3.5 h-3.5 text-gray-300" />
                </span>
                
                <span className="font-mono flex items-center gap-1 min-w-0 max-w-[60%]">
                  <span className="truncate" title={user.email}>{user.email}</span>
                  <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 justify-end">
                <button type="button" className="p-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-[10px] text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  دسترسی‌ها
                </button>
                <button type="button" className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-500 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
