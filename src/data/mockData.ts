/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Company, VehicleStatus } from '../types';
import { customNames } from './customDrivers';

// Seeded random number generator so data is deterministic and reproducible
function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const firstNames = [
  'علی', 'محمد', 'حسین', 'رضا', 'امیر', 'احمد', 'جواد', 'عباس', 'سعید', 'مهدی',
  'حمید', 'مصطفی', 'حسن', 'مسعود', 'وحید', 'محسن', 'علیرضا', 'محمدرضا', 'امیرحسین', 'مهسا',
  'فاطمه', 'زهرا', 'مریم', 'رقیه', 'زینب', 'نرگس', 'الهام', 'سارا', 'نسیم', 'شیما',
  'پیمان', 'سامان', 'کیوان', 'سهراب', 'فرزاد', 'امید', 'نوید', 'کامران', 'مهران', 'هادی',
  'مرتضی', 'مجید', 'میلاد', 'شهاب', 'حامد', 'سینا', 'بهزاد', 'آرش', 'نیما', 'پویا',
  'جلال', 'فرهاد', 'شایان', 'کمال', 'ستار', 'رامین', 'امید', 'سپهر', 'اشکان', 'سام'
];

const lastNames = [
  'رضایی', 'حسینی', 'محمدی', 'کریمی', 'موسوی', 'جعفری', 'قاسمی', 'هاشمی', 'احمدی', 'نعیمی',
  'سادین', 'کوهساری', 'یازرلو', 'سارلی', 'سعیدی', 'میرزایی', 'شاهینی', 'توزی', 'نیکنام', 'سالاری',
  'شکری', 'منوچهری', 'خجسته', 'راد', 'اکبری', 'باقری', 'مرادی', 'نادری', 'صادقی', 'رحیمی',
  'عظیمی', 'زارع', 'شریفی', 'امیدی', 'ناظری', 'فلاح', 'خرمی', 'دهقان', 'تاجیک', 'ابراهیمی',
  'افشار', 'پناهی', 'غفاری', 'یزدانی', 'نوروزی', 'صالحی', 'خدادادی', 'فتحی', 'کریمیان', 'توکلی',
  'کاوه', 'رستمی', 'بهرامی', 'مصلحی', 'نیکزاد', 'فرهمند', 'عادلی', 'سهرابی', 'منصوری', 'کوهستانی'
];

const companiesConfig = [
  { id: 'co-gorgan', name: 'جهادکشاورزی گرگان', count: 363, shortName: 'گرگان', minLat: 36.80, maxLat: 36.88, minLng: 54.38, maxLng: 54.48 },
  { id: 'co-industry-aliabad', name: 'صنعت معدن علی آباد', count: 171, shortName: 'علی‌آباد', minLat: 36.88, maxLat: 36.95, minLng: 54.80, maxLng: 54.91 },
  { id: 'co-gonbad', name: 'جهادکشاورزی گنبد', count: 125, shortName: 'گنبد', minLat: 37.20, maxLat: 37.30, minLng: 55.10, maxLng: 55.25 },
  { id: 'co-azadshahr', name: 'جهادکشاورزی آزادشهر', count: 78, shortName: 'آزادشهر', minLat: 37.05, maxLat: 37.12, minLng: 55.12, maxLng: 55.22 },
  { id: 'co-industry-ramian', name: 'صنعت و معدن رامیان', count: 16, shortName: 'رامیان', minLat: 36.98, maxLat: 37.04, minLng: 55.10, maxLng: 55.18 },
  { id: 'co-industry-kordkuy', name: 'صنعت و معدن کردکوی', count: 76, shortName: 'کردکوی', minLat: 36.76, maxLat: 36.82, minLng: 54.08, maxLng: 54.15 },
  { id: 'co-industry-bandargaz', name: 'صنعت و معدن بندرگز', count: 53, shortName: 'بندرگز', minLat: 36.75, maxLat: 36.80, minLng: 53.90, maxLng: 53.98 },
  { id: 'co-bandar-torkaman', name: 'صنعت و معدن بندر ترکمن', count: 25, shortName: 'بندر ترکمن', minLat: 36.85, maxLat: 36.92, minLng: 54.00, maxLng: 54.09 },
  { id: 'co-gomishan', name: 'جهادکشاورزی گمیشان', count: 10, shortName: 'گمیشان', minLat: 37.02, maxLat: 37.10, minLng: 54.00, maxLng: 54.10 },
];

function generateFleet(): { companies: Company[]; allVehicles: Vehicle[] } {
  const rg = createRandom(1405); // fixed seed
  const allVehicles: Vehicle[] = [];

  // 1. Create a pool of statuses to guarantee exactly 550 online-moving, 260 online-stopped,
  // and 107 offline (for a total of 917 vehicles).
  const statusPool: VehicleStatus[] = [];
  for (let i = 0; i < 550; i++) statusPool.push('moving');
  for (let i = 0; i < 260; i++) statusPool.push('stopped');
  for (let i = 0; i < 107; i++) statusPool.push('offline');

  // Shuffle the status pool deterministically
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(rg() * (i + 1));
    const temp = statusPool[i];
    statusPool[i] = statusPool[j];
    statusPool[j] = temp;
  }

  // Force ID '3' to be 'moving' to match App.tsx's default selected active vehicle
  const targetIdIndex = 2; // ID '3' corresponds to index 2 in raw generation loop
  if (statusPool[targetIdIndex] !== 'moving') {
    const movingIdx = statusPool.indexOf('moving');
    if (movingIdx !== -1) {
      const temp = statusPool[targetIdIndex];
      statusPool[targetIdIndex] = statusPool[movingIdx];
      statusPool[movingIdx] = temp;
    }
  }

  let globalVehicleIndex = 0;
  let offlineCountGlobal = 0;

  const companies: Company[] = companiesConfig.map((config) => {
    const companyVehicles: Vehicle[] = [];

    for (let i = 1; i <= config.count; i++) {
      const id = (globalVehicleIndex + 1).toString();
      const status = statusPool[globalVehicleIndex];
      globalVehicleIndex++;

      // Professional Iranian driver name selection
      let driverName = '';
      const driverNum = globalVehicleIndex + 1; // 1-based driver number
      if (driverNum >= 70) {
        const customIdx = (driverNum - 70) % customNames.length;
        driverName = customNames[customIdx];
      } else {
        const fn = firstNames[Math.floor(rg() * firstNames.length)];
        const ln = lastNames[Math.floor(rg() * lastNames.length)];
        driverName = `${fn} ${ln}`;
      }

      // Typical Iranian national license / permit code (e.g. 140********)
      const licensePart1 = 1400 + Math.floor(rg() * 5);
      const licensePart2 = Math.floor(rg() * 900000) + 100000;
      const license = `${licensePart1}${licensePart2}`;

      // Deterministic coordinates inside the local bounding box of county
      const lat = config.minLat + rg() * (config.maxLat - config.minLat);
      const lng = config.minLng + rg() * (config.maxLng - config.minLng);

      // Unique vehicle naming convention
      const name = `${config.shortName}${i < 10 ? '0' : ''}${i}`;

      let speed: number | null = null;
      let battery: number | null = null;
      let satellites: number | null = null;
      let gsm: number | null = null;
      let lastUpdate = 'هم‌اکنون';

      if (status === 'moving') {
        speed = Math.floor(rg() * 55) + 30; // 30 to 85 km/h
        battery = Math.floor(rg() * 30) + 70; // 70 to 100%
        satellites = Math.floor(rg() * 10) + 10; // 10 to 20 sats 
        gsm = Math.floor(rg() * 15) + 15; // 15 to 30 GSM DB
        lastUpdate = 'هم‌اکنون';
      } else if (status === 'stopped') {
        speed = 0;
        battery = Math.floor(rg() * 60) + 40; // 40 to 100%
        satellites = Math.floor(rg() * 8) + 8; // 8 to 16 sats
        gsm = Math.floor(rg() * 20) + 10; // 10 to 30 GSM DB
        
        const minutesAgo = Math.floor(rg() * 55) + 1;
        lastUpdate = `${minutesAgo} دقیقه پیش`;
      } else {
        // offline
        if (offlineCountGlobal < 14) {
          lastUpdate = 'بدون سیگنال';
          offlineCountGlobal++;
        } else {
          const hoursAgo = Math.floor(rg() * 23) + 1;
          lastUpdate = rg() > 0.5 ? `${hoursAgo} ساعت پیش` : '۱ روز پیش';
        }
      }

      const harshBrakesCount = Math.floor(rg() * 6); // 0 to 5
      const rapidAccelerationCount = Math.floor(rg() * 8); // 0 to 7
      const speedingEventsCount = Math.floor(rg() * 4); // 0 to 3
      const fuelConsumptionRate = Math.round((28.0 + rg() * 12.0) * 10) / 10; // 28.0 to 40.0 L/100km
      const rawScore = 100 - (harshBrakesCount * 5) - (rapidAccelerationCount * 3) - (speedingEventsCount * 7);
      const score = Math.max(50, Math.min(100, rawScore));
      
      let behaviorGrade = 'عالی';
      if (score < 65) {
        behaviorGrade = 'نیاز به احتیاط';
      } else if (score < 80) {
        behaviorGrade = 'متوسط';
      } else if (score < 92) {
        behaviorGrade = 'خوب';
      }

      let fStatus: 'safe' | 'warning' | 'critical' = 'safe';
      let unauthorizedDropDetected = false;
      let fuelSaleSuspected = false;
      let abnormalConsumptionDetected = false;
      let tankTamperedDetected = false;
      let integrityScore = 100;
      let logMessage = 'سنسورهای تله‌متری باک و جی‌پی‌اس در وضعیت همگام‌سازی کامل قرار دارند.';
      let stopDurationMinutes = 0;
      const lastCheckedVolume = Math.round(500 + rg() * 450); // liters

      const integrityType = i % 12;
      if (status === 'stopped' && integrityType === 0) {
        fStatus = 'critical';
        unauthorizedDropDetected = true;
        integrityScore = 35;
        stopDurationMinutes = 42;
        logMessage = 'تخلیه غیرمجاز: افت ناگهانی ۴۵ لیتری سوخت در موقعیت توقف حاشیه‌ای غیرمجاز ثبت شد!';
      } else if (status === 'stopped' && integrityType === 3) {
        fStatus = 'warning';
        fuelSaleSuspected = true;
        integrityScore = 58;
        stopDurationMinutes = 15;
        logMessage = 'مشکوک به فروش سوخت: توقف مکرر در جاده فرعی به همراه نوسان مشکوک شناور فیزیکی باک.';
      } else if (status === 'moving' && integrityType === 6) {
        fStatus = 'warning';
        abnormalConsumptionDetected = true;
        integrityScore = 72;
        logMessage = 'مصرف غیرعادی سوخت: مصرف ۴۲ لیتر در ۱۰۰ کیلومتر ترانزیت، مغایر با الگوی استاندارد جاده و بار.';
      } else if (integrityType === 9) {
        fStatus = 'critical';
        tankTamperedDetected = true;
        integrityScore = 20;
        stopDurationMinutes = 8;
        logMessage = 'دستکاری فیزیکی باک: تغییرات جریانی غیرعادی یا قطع کوتاه‌مدت پورت حسگر تله‌متری شناور.';
      } else {
        integrityScore = Math.floor(95 + rg() * 5);
      }

      const vehicle: Vehicle = {
        id,
        name,
        driver: driverName,
        license,
        speed,
        battery,
        satellites,
        gsm,
        status,
        companyId: config.id,
        lat,
        lng,
        lastUpdate,
        driverScore: {
          score,
          harshBrakesCount,
          rapidAccelerationCount,
          speedingEventsCount,
          fuelConsumptionRate,
          behaviorGrade
        },
        fuelIntegrity: {
          status: fStatus,
          unauthorizedDropDetected,
          fuelSaleSuspected,
          abnormalConsumptionDetected,
          tankTamperedDetected,
          lastCheckedVolume,
          stopDurationMinutes,
          integrityScore,
          logMessage
        }
      };

      companyVehicles.push(vehicle);
      allVehicles.push(vehicle);
    }

    return {
      id: config.id,
      name: config.name,
      vehicles: companyVehicles
    };
  });

  return { companies, allVehicles };
}

const generated = generateFleet();

export const mockCompanies: Company[] = generated.companies;
export const allVehicles: Vehicle[] = generated.allVehicles;
