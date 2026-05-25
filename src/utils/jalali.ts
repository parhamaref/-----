/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
}

const MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const WEEK_DAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

export function getJalaliDate(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  
  const jm = (days < 186) ? (1 + Math.floor(days / 31)) : (7 + Math.floor((days - 186) / 30));
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  
  return {
    year: jy,
    month: jm,
    day: jd,
    monthName: MONTH_NAMES[jm - 1],
    dayName: '' // will be assigned based on week day
  };
}

export function getFormattedJalali(date: Date = new Date()): string {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday ...
  
  const jd = getJalaliDate(gy, gm, gd);
  const dayName = WEEK_DAYS[dayOfWeek];
  
  // Convert numbers to Persian characters
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const toPersian = (num: number): string => {
    return num.toString().split('').map(digit => {
      const parsed = parseInt(digit, 10);
      return isNaN(parsed) ? digit : persianNumbers[parsed];
    }).join('');
  };
  
  return `${dayName}، ${toPersian(jd.day)} ${jd.monthName} ${toPersian(jd.year)}`;
}
export function convertToPersianNumbers(input: string | number): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  if (input === undefined || input === null) return '';
  return input.toString().split('').map(char => {
    const parsed = parseInt(char, 10);
    return isNaN(parsed) ? char : persianNumbers[parsed];
  }).join('');
}
export function formatPersianSpeed(speed: number | null): string {
  if (speed === null) return '—';
  return `${convertToPersianNumbers(speed)} کیلومتر بر ساعت`;
}
